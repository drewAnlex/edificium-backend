import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Payment } from '../entities/Payment.entity';
import { PaymentDTO, PaymentUpdateDTO } from '../dtos/Payment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { IndividualBillsService } from './individual-bills.service';
import { BuildingBillsService } from './building-bills.service';
import { ApartmentsService } from 'src/buildings/services/apartments.service';
import { OutboundService } from 'src/mailing/services/outbound.service';

interface PaginationParams {
  page?: number;
  limit?: number;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private ibService: IndividualBillsService,
    private bbService: BuildingBillsService,
    private apartmentService: ApartmentsService,
    private outboundService: OutboundService,
  ) {}

  findAll() {
    return this.paymentRepo.find({
      where: { isRemoved: false },
      relations: ['IndividualBill', 'UserId', 'Method', 'paymentInfos'],
    });
  }

  async findUserPayments(userId: number) {
    return await this.paymentRepo.find({
      where: {
        isRemoved: false,
        IndividualBill: {
          apartmentId: {
            userId: {
              id: userId,
            },
          },
        },
      },
      relations: [
        'IndividualBill',
        'Method',
        'paymentInfos',
        'IndividualBill.apartmentId',
        'IndividualBill.apartmentId.userId',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findBuildingPayments(buildingId: number, params?: PaginationParams) {
    const { page = 1, limit = 10 } = params || {};
    const skip = (page - 1) * limit;

    const [payments, total] = await this.paymentRepo.findAndCount({
      where: {
        isRemoved: false,
        IndividualBill: {
          apartmentId: {
            buildingId: {
              id: buildingId,
            },
          },
        },
      },
      relations: [
        'IndividualBill',
        'IndividualBill.apartmentId',
        'Method',
        'paymentInfos',
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id: id, isRemoved: false },
      relations: [
        'IndividualBill',
        'IndividualBill.apartmentId',
        'IndividualBill.buildingBillId',
        'UserId',
        'Method',
        'Method.paymentDetails',
        'paymentInfos',
      ],
    });
    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }
    return payment;
  }

  async create(data: PaymentDTO, id: number) {
    const newPayment = this.paymentRepo.create({ ...data, UserId: { id: id } });
    try {
      await this.paymentRepo.save(newPayment);
    } catch (error) {
      throw new HttpException(`Error ${error}`, 400);
    }
    return newPayment;
  }

  async update(id: number, changes: PaymentUpdateDTO) {
    const payment = await this.findOne(id);
    try {
      await this.paymentRepo.merge(payment, changes);
      await this.paymentRepo.save(payment);
    } catch (error) {
      throw new HttpException(`Error ${error}`, 400);
    }
    return payment;
  }

  async remove(id: number) {
    const payment = await this.findOne(id);
    try {
      this.paymentRepo.merge(payment, { isRemoved: true });
      await this.paymentRepo.save(payment);
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return payment;
  }

  async updateStatus(id: number, status: number) {
    const payment = await this.findOne(id);
    const bill = await this.ibService.findOne(payment.IndividualBill.id);

    let amount = parseFloat(payment.Amount.toString());
    let balance = parseFloat(bill.Balance.toString());

    const apartmentId = bill.apartmentId.id;
    const apartment = await this.apartmentService.findOne(apartmentId);
    const apartmentBalance = parseFloat(apartment.balance.toString());
    await this.apartmentService.update(apartmentId, {
      balance: apartmentBalance + amount,
    });

    // Actualizar la bill actual
    const newBalance = Math.min(balance + amount, bill.Total);
    amount -= newBalance - balance;
    balance = newBalance;
    await this.ibService.updateBalance(
      bill.id,
      balance,
      balance >= bill.Total ? true : false,
    );

    // Distribuir sobrante entre otras bills no pagas del apartment
    if (amount > 0) {
      const unpaidBills = await this.ibService.findUnpaidBillsByApartment(
        apartmentId,
      );

      for (const unpaidBill of unpaidBills) {
        if (amount <= 0) break;

        let unpaidBalance = parseFloat(unpaidBill.Balance.toString());
        const unpaidNewBalance = Math.min(
          unpaidBalance + amount,
          unpaidBill.Total,
        );
        amount -= unpaidNewBalance - unpaidBalance;
        unpaidBalance = unpaidNewBalance;

        await this.ibService.updateBalance(
          unpaidBill.id,
          unpaidBalance,
          unpaidBalance >= unpaidBill.Total ? true : false,
        );
      }
    }

    await this.paymentRepo.merge(payment, { Status: status });
    await this.paymentRepo.save(payment);

    try {
      await this.outboundService.paymentConfirmationEmail(
        apartment.userId.email,
        apartment.userId,
        payment,
      );
    } catch (error) {
      throw new HttpException(
        `An error occurred: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return payment;
  }

  async findPaymentsByApartmentIdentifier(
    identifier: string,
    buildingId: number,
    params?: PaginationParams,
  ) {
    const { page = 1, limit = 10 } = params || {};
    const skip = (page - 1) * limit;

    const [payments, total] = await this.paymentRepo.findAndCount({
      where: {
        isRemoved: false,
        IndividualBill: {
          apartmentId: {
            buildingId: { id: buildingId },
            identifier: ILike(`%${identifier}%`),
          },
        },
      },
      relations: [
        'IndividualBill',
        'IndividualBill.apartmentId',
        'Method',
        'paymentInfos',
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentsByApartment(apartmentId: number) {
    const payments = await this.paymentRepo.find({
      where: {
        isRemoved: false,
        IndividualBill: {
          apartmentId: { id: apartmentId },
        },
      },
      relations: ['IndividualBill', 'Method', 'paymentInfos'],
      order: { createdAt: 'DESC' },
    });

    return payments;
  }

  async getPendingPaymentsByBuilding(buildingId: number) {
    const payments = await this.paymentRepo.find({
      where: {
        isRemoved: false,
        Status: 0,
        IndividualBill: { apartmentId: { buildingId: { id: buildingId } } },
      },
      relations: ['IndividualBill', 'IndividualBill.apartmentId'],
    });
    return payments;
  }

  async reversePayment(id: number) {
    const payment = await this.findOne(id);
    const individualBill = await this.ibService.findOne(
      Number(payment.IndividualBill.id),
    );
    const apartment = await this.apartmentService.findOne(
      Number(individualBill.apartmentId.id),
    );

    // Revertir el balance del apartamento
    apartment.balance = Number(apartment.balance) - Number(payment.Amount);
    await this.apartmentService.update(Number(apartment.id), {
      balance: Number(apartment.balance),
    });

    // Revertir el estado del pago individual
    individualBill.Balance =
      Number(individualBill.Balance) - Number(payment.Amount);
    await this.ibService.update(Number(individualBill.id), {
      Balance: Number(individualBill.Balance),
    });

    individualBill.IsPaid = false;
    await this.ibService.update(Number(individualBill.id), {
      IsPaid: false,
    });

    // Revertir el estado del pago del edificio si existe
    if (individualBill.buildingBillId) {
      const buildingBill = await this.bbService.findOne(
        Number(individualBill.buildingBillId.id),
      );
      buildingBill.balance =
        Number(buildingBill.balance) - Number(payment.Amount);
      await this.bbService.update(Number(buildingBill.id), {
        balance: Number(buildingBill.balance),
      });
    }

    // Revertir el estado del pago
    await this.paymentRepo.merge(payment, { Status: 0 });
    await this.paymentRepo.save(payment);

    return payment;
  }

  async setAdminPaymentsToOwner(buildingId: number) {
    this.logger.log(
      `Iniciando actualización de pagos para el edificio ${buildingId}`,
    );
    const bills = await this.ibService.findAllByApartment(buildingId);
    this.logger.debug(`Se encontraron ${bills.length} facturas para procesar`);

    let totalPaymentsUpdated = 0;
    let totalBillsSkipped = 0;

    for (const bill of bills) {
      if (!bill.apartmentId?.userId) {
        totalBillsSkipped++;
        continue;
      }

      const apartmentUserId = bill.apartmentId.userId.id;
      const apartmentIdentifier = bill.apartmentId.identifier;

      for (const payment of bill.payment) {
        if (payment.UserId?.id !== apartmentUserId) {
          const oldUserId = payment.UserId?.id;
          payment.UserId = bill.apartmentId.userId;
          await this.paymentRepo.save(payment);
          totalPaymentsUpdated++;

          this.logger.debug(
            `Pago actualizado - Factura: ${bill.id}, Apartamento: ${apartmentIdentifier}, ` +
              `Usuario anterior: ${oldUserId}, Nuevo usuario: ${apartmentUserId}`,
          );
        }
      }
    }

    this.logger.log(
      `Proceso completado - Pagos actualizados: ${totalPaymentsUpdated}, ` +
        `Facturas omitidas: ${totalBillsSkipped}`,
    );
  }
}
