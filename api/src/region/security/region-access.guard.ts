import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { REGION_MODULE_OPTIONS, RegionModuleOptions } from '../region.options';

interface AuthenticatedRequest {
  method: string;
  user?: { role?: { id?: number | string } };
}

const PERMISSION_BY_METHOD: Record<string, string> = {
  GET: 'read:region',
  HEAD: 'read:region',
  POST: 'create:region',
  PATCH: 'update:region',
  PUT: 'update:region',
  DELETE: 'delete:region',
};

@Injectable()
export class RegionAccessGuard implements CanActivate {
  constructor(
    @Optional()
    @Inject(REGION_MODULE_OPTIONS)
    private readonly options?: RegionModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const permission = PERMISSION_BY_METHOD[request.method.toUpperCase()];
    const roleIds = (request.user?.roles ?? []).map((role) => role.id);

    // LOGGING: Debugging multi-role assignment
    console.log(`[RegionAccessGuard] Path: ${request.url}, UserID: ${request.user?.id}, RoleIDs found: ${JSON.stringify(roleIds)}, Permission: ${permission}`);

    if (!permission || roleIds.length === 0 || !this.options?.authorize) {
      throw new ForbiddenException();
    }

    let allowed = false;
    for (const roleId of roleIds) {
      if (await this.options.authorize(roleId, permission)) {
        allowed = true;
        break;
      }
    }

    if (!allowed) throw new ForbiddenException();
    return true;
  }
}
