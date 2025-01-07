import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpStatusCode } from 'axios';
import { UsersService } from 'src/users/services/users.service';
import { IndividualBillsService } from 'src/payments/services/individual-bills.service';
import { CurrencyValuePerDayService } from 'src/currency/services/currency-value-per-day.service';
import { PaymentMethodListService } from 'src/payment-method/services/payment-method-list.service';
import { PaymentMethodFieldsService } from 'src/payment-method/services/payment-method-fields.service';
import { PaymentsService } from 'src/payments/services/payments.service';
import { PaymentInfoService } from 'src/payments/services/payment-info.service';

@Injectable()
export class MessageHandlerService {
  paymentState;
  user;
  constructor(
    private whatsappService: WhatsappService,
    private userService: UsersService,
    private ibService: IndividualBillsService,
    private currencyValueService: CurrencyValuePerDayService,
    private paymentMethodListService: PaymentMethodListService,
    private paymentMethodFieldsService: PaymentMethodFieldsService,
    private paymentService: PaymentsService,
    private paymentInfoService: PaymentInfoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.paymentState = {};
  }

  async handleIncomingMessage(message: any, senderInfo: any) {
    try {
      const TTL = 300; // TTL en segundos
      const { from, id, type, text, interactive } = message;

      // Verificar si el usuario está registrado
      const isLoggedIn = await this.userService.findByPhone(from);

      // Verificar si el mensaje ya ha sido procesado
      const isProcessed = await this.cacheManager.get<boolean>(`${id}`);

      if (!isProcessed) {
        // Marcar el mensaje como procesado
        await this.cacheManager.set(`${id}`, true, TTL);

        if (isLoggedIn) {
          this.user = isLoggedIn;
          await this.handleLoggedInUserMessage(
            type,
            from,
            text,
            interactive,
            id,
          );
        } else {
          await this.handleUnregisteredUserMessage(
            type,
            from,
            id,
            senderInfo,
            interactive,
          );
        }

        // Marcar el mensaje como leído
        await this.whatsappService.markAsRead(id);
      }

      return 'mensaje manejado';
    } catch (error) {
      console.error('Error handling incoming message:', error);
      throw new Error('Error handling incoming message');
    }
  }

  private async handleLoggedInUserMessage(
    type: string,
    from: string,
    text: any,
    interactive: any,
    id: string,
  ) {
    if (type === 'text') {
      const incomingMessage = text.body.toLowerCase().trim();
      if (this.isGreeting(incomingMessage)) {
        // await this.sendWelcomeMessage(from, id, senderInfo);
        await this.sendBasicMenu(from);
      } else if (this.paymentState[from]) {
        await this.handlePaymentFlow(from, incomingMessage, id);
      } else {
        await this.handleMenuOption(from, incomingMessage, id);
      }
      await this.whatsappService.markAsRead(id);
    } else if (type === 'interactive') {
      const option = interactive?.button_reply?.id.toLowerCase().trim();
      await this.handleMenuOption(from, option, id);
      await this.whatsappService.markAsRead(id);
    }
  }

  private async handleUnregisteredUserMessage(
    type: string,
    from: string,
    id: string,
    senderInfo: any,
    interactive: any,
  ) {
    if (type === 'text') {
      await this.sendWelcomeMessage(from, id, senderInfo);
      await this.sendWelcomeMenuUnregistered(from);
    } else if (type === 'interactive') {
      const option = interactive?.button_reply?.id.toLowerCase().trim();
      await this.handleMenuOption(from, option, id);
    }
  }

  isGreeting(message: any) {
    const greetings = ['hola', 'hello', 'hi', 'buenas tardes'];
    return greetings.includes(message);
  }

  getSenderName(senderInfo: any) {
    return senderInfo.profile?.name || senderInfo.wa_id || '';
  }

  async sendWelcomeMessage(to: string, messageId: any, senderInfo: any) {
    try {
      const name = this.getSenderName(senderInfo);
      const firstName = name.split(' ')[0];
      const welcomeMessage = `Hola, ${firstName}, bienvenido a Nexi, tu servidcio de administración de inmuebles \n¿En que puedo ayudarte hoy?`;
      await this.whatsappService.sendMessage(to, welcomeMessage, messageId);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al enviar el mensaje de bienvenida',
        HttpStatusCode.BadRequest,
      );
    }
  }

  async sendWelcomeMenuUnregistered(to: string) {
    const menuMessage =
      'Parece que no has registrado este numero ¿En que puedo ayudarte?';
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'register_option',
          title: 'Vincular numero',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'sales_option',
          title: 'Cotizar',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'support_option',
          title: 'Soporte Tecnico',
        },
      },
    ];
    await this.whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  async sendBasicMenu(to: string) {
    const menuMessage = '¿En que puedo ayudarte?';
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'debt_option',
          title: 'Balance general',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'bills_option',
          title: 'Recibos pendientes',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'payment_option',
          title: 'Pagar',
        },
      },
    ];
    await this.whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  async handlePaymentFlow(from: string, message: any, messageId: any) {
    const state = this.paymentState[from];
    let response;
    switch (state.step) {
      case 'bill':
        try {
          const paymentMethods =
            await this.paymentMethodListService.findByIndividualBill(message);
          if (!paymentMethods || paymentMethods.length === 0) {
            response =
              'Lo siento, no pude traer los métodos de pago. Intenta más tarde';
            break;
          }

          // Espera a que todos los métodos de pago estén listos
          const resolvedPaymentMethods = await Promise.all(paymentMethods);

          // Formatear la información de los métodos de pago
          const paymentMethodsInfo = resolvedPaymentMethods
            .map((method) => {
              const details = method.paymentDetails
                .map((detail) => `${detail.Name}: ${detail.description}`)
                .join('\n');
              return `Método: ${method.name} - ID:${method.id}\nDetalles:\n${details}`;
            })
            .join('\n\n');

          state.bill = message;
          state.step = 'paymentMethod';
          response = `Ahora indícame qué método de pago deseas usar.\n${paymentMethodsInfo}\nIndica el ID del método de pago:`;
        } catch (error) {
          console.error('Error fetching payment methods:', error);
          response =
            'Ocurrió un error al traer los métodos de pago. Intenta más tarde';
        }
        break;

      case 'paymentMethod':
        state.paymentMethod = message;
        state.step = 'paymentAmount';
        response = 'Ingresa la cantidad de dinero pagada:';
        break;

      case 'paymentFields':
        try {
          const fields = await this.paymentMethodFieldsService.findByMethod(
            state.paymentMethod,
          );
          if (!fields || fields.length === 0) {
            response =
              'Lo siento, no pude traer los campos de información necesarios para completar el pago. Intenta más tarde';
            break;
          }

          // Almacenar los campos de información necesarios en el estado
          state.paymentFields = fields.map((field) => ({
            ...field,
            value: null, // Inicialmente, los campos no tienen valor
          }));

          // Solicitar el primer campo de información
          state.currentFieldIndex = 0; // Índice del campo actual que se está solicitando
          response = `Por favor, proporciona ${
            state.paymentFields[state.currentFieldIndex].name
          }`;
          state.step = 'collectingPaymentInfo';
        } catch (error) {
          console.error('Error fetching payment fields:', error);
          response =
            'Ocurrió un error al traer los campos de información necesarios. Intenta más tarde';
        }
        break;

      case 'collectingPaymentInfo':
        try {
          const currentField = state.paymentFields[state.currentFieldIndex];

          // Guardar el valor proporcionado por el usuario
          currentField.value = message;

          // Verificar si hay más campos por completar
          if (state.currentFieldIndex < state.paymentFields.length - 1) {
            state.currentFieldIndex += 1; // Pasar al siguiente campo
            const nextField = state.paymentFields[state.currentFieldIndex];
            response = `Por favor, proporciona ${nextField.name}`;
          } else {
            // Todos los campos han sido completados
            response = `Gracias, he recibido toda la información necesaria para el pago. Procediendo con el procesamiento del pago...\nNúmero: ${state.bill}\nMétodo: ${state.paymentMethod} \nCantidad: ${state.paymentAmount} \n\nEsta es la información que se enviará a tu administrador, verificala para que pueda enviarsela!\n\nResponde con Si o No para confirmar`;
            state.step = 'confirmation'; // Reiniciar el estado del flujo de pago
          }
        } catch (error) {
          console.error('Error collecting payment info:', error);
          response =
            'Ocurrió un error al procesar la información del pago. Intenta más tarde';
        }
        break;

      case 'paymentAmount':
        state.paymentAmount = message;
        state.step = 'paymentFields';
        response = 'Perfecto! Envia tu apartamento (1A,2B,3C...)';
        break;
      case 'confirmation':
        state.confirmation = message.toLowerCase();
        if (state.confirmation === 'si') {
          response =
            'Tu pago fue reportado con éxito, espera a la confirmación de tu administrador.';
          state.step = null;

          try {
            const paymentData = {
              IndividualBill: state.bill,
              Method: state.paymentMethod,
              Amount: state.paymentAmount,
              PayCode: '',
              UserId: this.user,
            };

            const payment = await this.paymentService.create(
              paymentData,
              this.user.id,
            );

            for (const field of state.paymentFields) {
              const paymentInfoData = {
                methodId: state.paymentMethod,
                payment: payment,
                name: field.name,
                value: field.value,
              };
              await this.paymentInfoService.create(paymentInfoData);
            }
          } catch (error) {
            console.error('Error reporting payment:', error);
            response =
              'Hubo un error al reportar tu pago. Por favor, intenta nuevamente.';
          }
        } else if (state.confirmation === 'no') {
          response = 'Vaya, vuelve a intentarlo nuevamente!';
          state.step = null;
        }
        break;

      default:
        response =
          'Ups, parace que no fui programado para entender este mensaje.';
        break;
    }
    await this.whatsappService.sendMessage(from, response, messageId);
  }

  async sendContactIT(to: string) {
    const contact = {
      addresses: [
        {
          street: '',
          city: 'Caracas',
          state: 'Miranda',
          zip: '1080',
          country: 'Venezuela',
          country_code: 'VE',
          type: 'WORK',
        },
      ],
      emails: [
        {
          email: 'andrewroa01@gmail.com',
          type: 'WORK',
        },
      ],
      name: {
        formatted_name: 'Andrew de Nexi',
        first_name: 'Andrew',
        last_name: 'Nexi',
        middle_name: '',
        suffix: '',
        prefix: '',
      },
      org: {
        company: 'NexiAdmin',
        department: 'IT',
        title: 'Soporte',
      },
      phones: [
        {
          phone: '+584243568411',
          wa_id: '584243568411',
          type: 'WORK',
        },
      ],
      urls: [
        {
          url: 'https://nexiadmin.com',
          type: 'WORK',
        },
      ],
    };

    await this.whatsappService.sendContactMessage(to, contact);
  }

  async sendContactSales(to: string) {
    const contact = {
      addresses: [
        {
          street: '',
          city: 'Caracas',
          state: 'Miranda',
          zip: '1080',
          country: 'Venezuela',
          country_code: 'VE',
          type: 'WORK',
        },
      ],
      emails: [
        {
          email: 'andrewroa01@gmail.com',
          type: 'WORK',
        },
      ],
      name: {
        formatted_name: 'Andrew de Nexi',
        first_name: 'Andrew',
        last_name: 'Nexi',
        middle_name: '',
        suffix: '',
        prefix: '',
      },
      org: {
        company: 'NexiAdmin',
        department: 'Ventas',
        title: 'Representante',
      },
      phones: [
        {
          phone: '+584243568411',
          wa_id: '584243568411',
          type: 'WORK',
        },
      ],
      urls: [
        {
          url: 'https://nexiadmin.com',
          type: 'WORK',
        },
      ],
    };

    await this.whatsappService.sendContactMessage(to, contact);
  }

  async handleMenuOption(from: string, option: string, id: any) {
    let response;
    let user;
    const currencyValue = await this.currencyValueService.getLatestValue(1);
    switch (option) {
      case 'register_option':
        response = 'Vincula tu numero';
        break;
      case 'sales_option':
        response =
          'Aquí tienes el contacto de nuestro representante de ventas!';
        await this.sendContactSales(from);
        break;
      case 'support_option':
        response = 'Aquí tienes el contacto de soporte tecnico!';
        await this.sendContactIT(from);
        break;

      case 'debt_option':
        user = await this.userService.findByPhone(from);
        if (!user) {
          response = 'Lo siento, no pude traer tu balance. Intenta más tarde';
          break;
        }
        const debt = await this.ibService.individualDebt(user.id || 0);
        if (debt < 0) {
          response = `Tu deuda es de \n${debt * -1}$ \n${(
            debt *
            -1 *
            currencyValue.value
          ).toFixed(2)}Bs`;
        } else if (debt == 0) {
          response = 'Tu balance es 0$';
        }
        break;

      case 'bills_option':
        user = await this.userService.findByPhone(from);
        if (!user) {
          response = 'Lo siento, no pude traer tu balance. Intenta más tarde';
          break;
        }

        // Resuelve todas las promesas de los recibos pendientes
        const billsPromises = user.apartments.map(async (apartment) => {
          const bills = await this.ibService.findUnpaidBillsByApartment(
            apartment.id,
          );
          // Añadir el identificador del apartamento a cada bill
          return bills.map((bill) => ({
            ...bill,
            apartmentIdentifier: apartment.identifier,
          }));
        });

        // Espera a que todas las promesas se resuelvan
        const bills = await Promise.all(billsPromises);

        // Filtrar y extraer solo los campos necesarios de cada bill que no estén pagados ni eliminados
        const filteredBills = bills
          .flat()
          .filter((bill) => !bill.isPaid && !bill.isRemoved);
        const billsDetails = filteredBills.map((bill) => ({
          id: bill.id,
          name: bill.Name,
          description: bill.Description,
          total: bill.Total,
          apartmentIdentifier: bill.apartmentIdentifier,
          balance: bill.Balance,
        }));

        // Construir la respuesta una vez que los datos estén disponibles
        for (const bill of billsDetails) {
          response = `Número: ${bill.id}\nApartamento: ${
            bill.apartmentIdentifier
          }\n*${bill.name}*\n${bill.description}\nPor pagar:\n${
            bill.total - bill.balance
          }$\n${((bill.total - bill.balance) * currencyValue.value).toFixed(
            2,
          )}Bs \n ----`;
          await this.whatsappService.sendMessage(from, response, id);
        }
        response = 'Estos son todos tus recibos pendientes.';
        break;

      case 'payment_option':
        this.paymentState[from] = { step: 'bill' };
        response = '¿Cual recibo quieres pagar? Dime el numero de recibo.';
        break;

      default:
        response =
          'Lo siento, no entendí tu selección, por favor elige una de las opciones del menú o di "Hola" para ver el menu';
        break;
    }
    await this.whatsappService.sendMessage(from, response, id);
  }
}
