import {
  DynamicModule,
  InjectionToken,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './infrastructure/persistence/relational/entities/province.entity';
import { RegencyEntity } from './infrastructure/persistence/relational/entities/regency.entity';
import { RegionService } from './services/region.service';
import { RegionController } from './controllers/region.controller';
import { RegionSeedService } from './database/region-seed.service';
import { ProvinceRepository } from './infrastructure/persistence/province.repository';
import { RegencyRepository } from './infrastructure/persistence/regency.repository';
import { ProvincesRelationalRepository } from './infrastructure/persistence/relational/repositories/province.repository';
import { RegenciesRelationalRepository } from './infrastructure/persistence/relational/repositories/regency.repository';
import { RegionAccessGuard } from './security/region-access.guard';

export interface RegionModuleOptions {
  /** Delegate permission decisions to the host's authorization service. */
  authorize: (
    roleId: number | string,
    permission: string,
  ) => boolean | Promise<boolean>;
}

export interface RegionModuleAsyncOptions {
  imports?: DynamicModule['imports'];
  inject?: InjectionToken[];
  useFactory: (...dependencies: any[]) =>
    | RegionModuleOptions
    | Promise<RegionModuleOptions>;
}

export const REGION_MODULE_OPTIONS = Symbol.for('@wasnaker/module-region/options');

@Module({
  imports: [TypeOrmModule.forFeature([ProvinceEntity, RegencyEntity])],
  providers: [
    RegionService,
    RegionSeedService,
    RegionAccessGuard,
    { provide: ProvinceRepository, useClass: ProvincesRelationalRepository },
    { provide: RegencyRepository, useClass: RegenciesRelationalRepository },
  ],
  controllers: [RegionController],
  exports: [RegionService, RegionSeedService],
})
export class RegionModule {
  static registerAsync(options: RegionModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: REGION_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    };

    return {
      module: RegionModule,
      imports: options.imports ?? [],
      providers: [optionsProvider],
    };
  }
}
