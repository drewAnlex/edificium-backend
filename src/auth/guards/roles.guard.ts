import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener roles requeridos del decorador
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    // Obtener usuario de la request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role) {
      throw new UnauthorizedException('Usuario no tiene roles asignados');
    }

    // Verificar al menos un rol coincide
    const hasRequiredRole = user.role.some(
      (userRole) => requiredRoles.includes(userRole.Name), // Asumiendo que los roles tienen propiedad 'name'
    );

    if (!hasRequiredRole) {
      throw new UnauthorizedException('No tienes los permisos necesarios');
    }

    return true;
  }
}
