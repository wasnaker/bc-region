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
  url?: string;
  user?: {
    id?: number | string;
    role?: { id?: number | string } | null;
    roles?: Array<{ id?: number | string }>;
  };
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
    if (this.options?.isModuleActive && !(await this.options.isModuleActive())) {
      throw new ForbiddenException('Region module is inactive');
    }
    const permission = PERMISSION_BY_METHOD[request.method.toUpperCase()];
    const userId = request.user?.id;
    if (userId === undefined || userId === null || !permission || !this.options?.resolveScopes) {
      throw new ForbiddenException();
    }

    // Region master data is global, but module Roles still need a current
    // Core-managed grant and an active assignment scope.
    const resolved = await this.options.resolveScopes(userId, permission);
    if (!resolved.global && resolved.scopes.length === 0) {
      throw new ForbiddenException();
    }
    return true;
  }
}
