# bc-region

Region domain module for Indonesian administrative divisions (Province & Regency/Kota).

## Entities

| Entity | Description |
|--------|-------------|
| **Province** | Indonesian province. Fields: `name`, `isoCode`, `latitude`, `longitude` |
| **Regency** | Regency or city. Belongs to a Province. Fields: `name`, `type` (`kabupaten` \| `kota`), `isActive` |

## Architecture

Clean Architecture / Repository Pattern:

```
domain/           → Pure domain models (Province, Regency)
dto/              → CreateDto, UpdateDto, QueryDto (with class-validator)
infrastructure/
  persistence/     → Abstract Repository interfaces
    relational/
      entities/    → TypeORM entities (ProvinceEntity, RegencyEntity)
      mappers/    → Domain ↔ Entity bidirectional mapper
      repositories/ → TypeORM implementation of repositories
```

## DTOs

### Province
| DTO | Fields |
|-----|--------|
| `CreateProvinceDto` | `name`, `isoCode?`, `latitude?`, `longitude?` |
| `UpdateProvinceDto` | all fields optional |
| `QueryProvinceDto` | `page`, `limit`, `filters` (search), `sort` |

### Regency
| DTO | Fields |
|-----|--------|
| `CreateRegencyDto` | `provinceId`, `name`, `type` (enum), `isActive?` |
| `UpdateRegencyDto` | all fields optional |
| `QueryRegencyDto` | `page`, `limit`, `filters` (`provinceId`, `type`), `sort` |

## Repository Methods

### ProvinceRepository
- `create`, `findManyWithPagination`, `findAll`, `findById`, `findByIsoCode`, `countAll`, `update`, `remove`

### RegencyRepository
- `create`, `findManyWithPagination`, `findAll`, `findById`, `findByProvinceId`, `countByProvinceId`, `countAll`, `update`, `remove`, `removeByProvinceId`

## TypeORM Schema

| Table | Key Columns | Indexes |
|-------|------------|---------|
| `province` | `id` (PK), `name`, `isoCode` (unique), `latitude`, `longitude` | `name` |
| `regency` | `id` (PK), `provinceId` (FK → province.id, CASCADE), `name`, `type`, `isActive` | `provinceId`, `name` |

## License

[GNU General Public License v2](LICENSE)
