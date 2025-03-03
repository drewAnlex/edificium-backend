import { Injectable } from '@nestjs/common';
import { PaymentsService } from 'src/payments/services/payments.service';
import { BuildingsService } from 'src/buildings/services/buildings.service';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class AdminMenuHandlerService {
  constructor(
    private paymentsService: PaymentsService,
    private buildingsService: BuildingsService,
    private whatsappService: WhatsappService,
  ) {}

  /**
   * Envía el menú principal de administradores con botones interactivos
   * @param to Número de teléfono del destinatario
   * @returns Mensaje de confirmación
   */
  async sendAdminMainMenu(to: string): Promise<string> {
    const menuMessage = '*🔐Menú de Administrador*';
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'admin_apartment_payments',
          title: 'Pagos por apartamento',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'admin_building_summary',
          title: 'Resumen del edificio',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'admin_pending_bills',
          title: 'Facturas pendientes',
        },
      },
    ];
    await this.whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
    return 'Menú de administrador enviado';
  }

  /**
   * Procesa la selección del menú de administrador
   * @param option Opción seleccionada
   * @param to Número de teléfono del destinatario
   */
  async processAdminMenuSelection(option: string, to: string): Promise<string> {
    switch (option) {
      case 'admin_apartment_payments':
        return this.handleApartmentPaymentsOption();
      case 'admin_building_summary':
        return this.handleBuildingPaymentsSummary();
      case 'admin_pending_bills':
        return this.handlePendingBillsStatus();
      case 'admin_monthly_report':
        return this.handleMonthlyReport();
      default:
        return 'Opción no válida. Por favor, selecciona una opción del menú.';
    }
  }

  /**
   * Maneja la opción de consulta de pagos por apartamento
   */
  handleApartmentPaymentsOption(): string {
    return `*Consulta de Pagos por Apartamento*
    
Por favor, envía el identificador del apartamento (ejemplo: A101)`;
  }

  /**
   * Busca pagos por identificador de apartamento
   * @param identifier Identificador del apartamento
   */
  async searchPaymentsByApartment(identifier: string): Promise<string> {
    try {
      const result =
        await this.paymentsService.findPaymentsByApartmentIdentifier(
          identifier,
          { limit: 5 },
        );

      if (result.data.length === 0) {
        return `No se encontraron pagos para el apartamento ${identifier}.`;
      }

      let response = `*Pagos del apartamento ${identifier}*\n\n`;

      result.data.forEach((payment, index) => {
        response += `*Pago #${index + 1}*\n`;
        response += `📅 Fecha: ${new Date(
          payment.createdAt,
        ).toLocaleDateString()}\n`;
        response += `💰 Monto: ${payment.Amount}\n`;
        response += `🏷️ Estado: ${
          payment.Status === 1 ? 'Confirmado' : 'Pendiente'
        }\n`;
        response += `📝 Método: ${
          payment.Method?.name || 'No especificado'
        }\n\n`;
      });

      response += `Mostrando ${result.data.length} de ${result.meta.total} pagos.`;

      return response;
    } catch (error) {
      console.error('Error al buscar pagos:', error);
      return 'Ocurrió un error al buscar los pagos. Por favor, intenta nuevamente.';
    }
  }

  /**
   * Maneja la opción de resumen de pagos del edificio
   */
  async handleBuildingPaymentsSummary(): Promise<string> {
    return `*Resumen de Pagos del Edificio*
    
Para ver el resumen de pagos, por favor envía el ID del edificio.`;
  }

  /**
   * Maneja la opción de estado de facturas pendientes
   */
  handlePendingBillsStatus(): string {
    return `*Estado de Facturas Pendientes*
    
Esta función estará disponible próximamente.`;
  }

  /**
   * Maneja la opción de generación de reporte mensual
   */
  handleMonthlyReport(): string {
    return `*Generación de Reporte Mensual*
    
Esta función estará disponible próximamente.`;
  }
}
