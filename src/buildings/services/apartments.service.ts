import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAparmentDTO, UpdateAparmentDTO } from '../dtos/apartment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment) private apartmentRepo: Repository<Apartment>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async auditBalances(building: number) {
    const apartments = await this.apartmentRepo.find({
      where: { buildingId: { id: building } },
      relations: ['individualBills', 'userId.payments'],
    });

    const discrepancies = [];

    for (const apartment of apartments) {
      const sumBills = apartment.individualBills.reduce(
        (acc, bill) => acc + (Number(bill.Balance) || 0),
        0,
      );

      const sumPayments = apartment.userId.payments.reduce(
        (acc, payment) => acc + (Number(payment.Amount) || 0),
        0,
      );

      const expectedBalance = sumBills - sumPayments;
      const balanceDifference = expectedBalance - apartment.balance;

      if (Math.abs(balanceDifference) > 0.0099) {
        const discrepancyReason =
          balanceDifference > 0
            ? `Balance es $${balanceDifference.toFixed(
                2,
              )} más bajo de lo esperado (Posibles pagos faltantes o facturas adicionales)`
            : `Balance es $${Math.abs(balanceDifference).toFixed(
                2,
              )} más alto de lo esperado (Posibles facturas faltantes o pagos adicionales)`;

        discrepancies.push({
          apartmentId: apartment.id,
          apartmentIdentifier: apartment.identifier,
          currentBalance: apartment.balance,
          expectedBalance: Number(expectedBalance.toFixed(2)),
          individualBillsTotal: sumBills,
          paymentsTotal: sumPayments,
          discrepancyReason, // Nueva propiedad añadida
        });
      }
    }

    return discrepancies;
  }

  async findAll() {
    return await this.apartmentRepo.find({
      relations: ['buildingId', 'userId', 'individualBills'],
    });
  }

  async findByIdentifier(identifier: string, buildingId: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { identifier, buildingId: { id: buildingId } },
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${identifier} not found`);
    }
    return apartment;
  }

  async findOne(id: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { id },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    return apartment;
  }

  async findOneByAdmin(id: number, buildingId: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { id, buildingId: { id: buildingId } },
      relations: [
        'buildingId',
        'userId',
        'individualBills',
        'individualBills.apartmentId',
        'individualBills.buildingBillId',
      ],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    apartment.individualBills = apartment.individualBills.filter(
      (bill) => bill.isRemoved === false,
    );
    return apartment;
  }

  async getApartmentsByBuilding(id: number) {
    const apartments = await this.apartmentRepo
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.userId', 'user')
      .leftJoinAndSelect('apartment.individualBills', 'individualBills')
      .where('apartment.buildingId = :buildingId', { buildingId: id })
      .orderBy(
        `CASE
               WHEN apartment.identifier ~ '^[0-9]' THEN CAST(substring(apartment.identifier, 1, length(apartment.identifier) - 1) AS INTEGER)
               ELSE 9999
             END`,
      )
      .addOrderBy(
        `CASE
                   WHEN apartment.identifier ~ '^[0-9]' THEN substring(apartment.identifier, -1)
                   ELSE apartment.identifier
                 END`,
      )
      .getMany();

    if (!apartments) {
      throw new NotFoundException(`Apartments not found`);
    }

    apartments.forEach((apartment) => {
      apartment.individualBills = apartment.individualBills.filter(
        (bill) => bill.IsPaid === false && bill.isRemoved === false,
      );
    });
    return apartments;
  }

  async getApartmentsByOwner(id: number) {
    const apartments = await this.apartmentRepo.find({
      where: { userId: { id } },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartments) {
      throw new NotFoundException(`Apartments not found`);
    }
    return apartments;
  }

  async findOneByOwner(id: number, userId: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { id, userId: { id: userId } },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${id} not found`);
    }
    return apartment;
  }

  async create(payload: CreateAparmentDTO) {
    const newApartment = this.apartmentRepo.create(payload);
    newApartment.uuid = uuidv4();
    try {
      await this.apartmentRepo.save(newApartment);
    } catch (error) {
      throw new HttpException(
        `Creation Error ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return newApartment;
  }

  async update(id: number, payload: UpdateAparmentDTO) {
    const apartment = await this.findOne(id);
    try {
      await this.apartmentRepo.merge(apartment, payload);
      await this.apartmentRepo.save(apartment);
    } catch (error) {
      throw new HttpException(`Update Error ${error}`, HttpStatus.BAD_REQUEST);
    }
    return apartment;
  }

  remove(id: number) {
    return this.apartmentRepo.delete(id);
  }

  async setApartmentToUser(uuid: string, userId: number) {
    const apartment = await this.apartmentRepo.findOne({
      where: { uuid },
      relations: ['buildingId', 'userId', 'individualBills'],
    });
    if (!apartment) {
      throw new NotFoundException(`Apartment #${uuid} not found`);
    }
    const user = await this.userService.findOne(userId);
    apartment.userId = user;
    await this.apartmentRepo.save(apartment);
    return { message: 'User assigned to apartment' };
  }
}
