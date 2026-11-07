import { CreateRegion1793466257948 } from './1793466257948612617-CreateRegion';
import { AddRegionUniquenessConstraints1793466257949 } from './1793466257948612618-AddRegionUniquenessConstraints';
import { AddRegencyCode1793710213000000000 } from './1793710213000000000-AddRegencyCode';

export { CreateRegion1793466257948 };
export { AddRegionUniquenessConstraints1793466257949 };
export { AddRegencyCode1793710213000000000 };

/** Standard package contract consumed by the host's generated registry. */
export const moduleMigrations = [
  CreateRegion1793466257948,
  AddRegionUniquenessConstraints1793466257949,
  AddRegencyCode1793710213000000000,
] as const;
