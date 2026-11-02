import { CanActivate, ExecutionContext, Inject, Injectable, Optional } from '@nestjs/common';
import { REGION_MODULE_OPTIONS, RegionModuleOptions } from '../region.module';

interface AuthenticatedRequest {
  user?: { role?: { id?: number | string } };
}

@Injectable()
export class RegionWriteGuard implements CanActivate {
  constructor(
    @Optional()
    @Inject(REGION_MODULE_OPTIONS)
    private readonly options?: RegionModuleOptions,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const roleId = request.user?.role?.id;
    return (
      roleId !== undefined &&
      (this.options?.adminRoleIds ?? []).some(
        (allowedRoleId) => String(allowedRoleId) === String(roleId),
      )
    );
  }
}
