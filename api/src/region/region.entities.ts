import { ProvinceEntity } from './infrastructure/persistence/relational/entities/province.entity';
import { RegencyEntity } from './infrastructure/persistence/relational/entities/regency.entity';

/** Entity metadata owned by this module; register with the host TypeORM DataSource. */
export const REGION_ENTITIES = [ProvinceEntity, RegencyEntity] as const;

export { ProvinceEntity, RegencyEntity };
