import { CreateRegion1793466257948612617 } from './1793466257948612617-CreateRegion';
import { AddRegionUniquenessConstraints1793466257948612618 } from './1793466257948612618-AddRegionUniquenessConstraints';

export { CreateRegion1793466257948612617 };
export { AddRegionUniquenessConstraints1793466257948612618 };

/** Standard package contract consumed by the host's generated registry. */
export const moduleMigrations = [
  CreateRegion1793466257948612617,
  AddRegionUniquenessConstraints1793466257948612618,
] as const;
