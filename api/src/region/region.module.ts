import { DynamicModule, Module } from '@nestjs/common';
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
import { RegionWriteGuard } from './security/region-write.guard';

export interface RegionModuleOptions {
  /** Host role IDs allowed to mutate Region records. */
  adminRoleIds: Array<number | string>;
}

export const REGION_MODULE_OPTIONS = Symbol.for('@wasnaker/module-region/options');

@Module({
  imports: [
    TypeOrmModule.forFeature([ProvinceEntity, RegencyEntity]),
  ],
  providers: [
    RegionService,
    RegionSeedService,
    RegionWriteGuard,
    { provide: ProvinceRepository, useClass: ProvincesRelationalRepository },
    { provide: RegencyRepository, useClass: RegenciesRelationalRepository },
  ],
  controllers: [RegionController],
  exports: [RegionService, RegionSeedService],
})
export class RegionModule {
  static register(options: RegionModuleOptions): DynamicModule {
    return {
      module: RegionModule,
      providers: [{ provide: REGION_MODULE_OPTIONS, useValue: options }],
    };
  }
}
