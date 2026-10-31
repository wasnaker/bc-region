# Region Module Integration Guide

This guide covers integrating `bc-region/api/` into the host `brocoders-api` application.

## Step 1 — Copy source files

Copy the entire `src/region/` and `src/utils/` directories from this module into the host app:

```
cp -r bc-region/api/src/region/  brocoders-api/src/
cp -r bc-region/api/src/utils/   brocoders-api/src/
```

The `src/utils/` additions are:
- `src/utils/types/nullable.type.ts`
- `src/utils/types/deep-partial.type.ts`
- `src/utils/types/pagination-options.ts`
- `src/utils/infinity-pagination.ts`
- `src/utils/dto/infinity-pagination-response.dto.ts`
- `src/utils/relational-entity-helper.ts`

All of these are standalone and do not conflict with existing host utils.

## Step 2 — Register RegionModule

Open `brocoders-api/src/app.module.ts` and add `RegionModule` to the `imports` array:

```ts
import { RegionModule } from './region/region.module';

@Module({
  imports: [
    // ... existing modules ...
    RegionModule,
  ],
  // ...
})
export class AppModule {}
```

## Step 3 — Run database migration

Generate and run a TypeORM migration for the `province` and `regency` tables.

### Entity column summary

**`province` table:**
| Column | Type | Constraints |
|---|---|---|
| `id` | `int` (auto) | PRIMARY KEY |
| `name` | `varchar(190)` | NOT NULL, INDEX |
| `isoCode` | `varchar(10)` | UNIQUE, NULLABLE |
| `latitude` | `decimal(10,6)` | NULLABLE |
| `longitude` | `decimal(10,6)` | NULLABLE |
| `createdAt` | `datetime` | NOT NULL |
| `updatedAt` | `datetime` | NOT NULL |

**`regency` table:**
| Column | Type | Constraints |
|---|---|---|
| `id` | `int` (auto) | PRIMARY KEY |
| `provinceId` | `int` | NOT NULL, INDEX, FK → `province(id)` ON DELETE CASCADE |
| `name` | `varchar(190)` | NOT NULL, INDEX |
| `type` | `varchar` (default `'kabupaten'`) | NOT NULL |
| `isActive` | `boolean` (default `true`) | NOT NULL |
| `createdAt` | `datetime` | NOT NULL |
| `updatedAt` | `datetime` | NOT NULL |

### Migration command

```bash
cd brocoders-api
npm run migration:generate -- src/migrations/region-init
npm run migration:run
```

Alternatively, run this SQL directly against `brocoders` MySQL:

```sql
CREATE TABLE IF NOT EXISTS `province` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(190) NOT NULL,
  `isoCode` VARCHAR(10) NULL UNIQUE,
  `latitude` DECIMAL(10,6) NULL,
  `longitude` DECIMAL(10,6) NULL,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  INDEX `idx_province_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `regency` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `provinceId` INT NOT NULL,
  `name` VARCHAR(190) NOT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'kabupaten',
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  INDEX `idx_regency_provinceId` (`provinceId`),
  INDEX `idx_regency_name` (`name`),
  CONSTRAINT `fk_regency_province` FOREIGN KEY (`provinceId`) REFERENCES `province`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Step 4 — Add RBAC guard (optional but recommended)

The `RegionController` is protected with `@UseGuards(AuthGuard('jwt'))` (JWT auth required). For **admin-only write endpoints**, add `@Roles(RoleEnum.admin)` + `RolesGuard` by wrapping the write methods. Edit `RegionController` and add the guard to the class or individual endpoints:

```ts
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Region')
// For write-only guards on specific methods:
@Roles(RoleEnum.admin)
@Post('provinces')
// ...
```

## API paths

All endpoints are prefixed with the NestJS version (`/api/v1`):

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/region/provinces` | Create province |
| GET | `/api/v1/region/provinces` | List provinces (paginated) |
| GET | `/api/v1/region/provinces/:id` | Get province by ID |
| PATCH | `/api/v1/region/provinces/:id` | Update province |
| DELETE | `/api/v1/region/provinces/:id` | Delete province (cascades to regencies) |
| POST | `/api/v1/region/regencies` | Create regency |
| GET | `/api/v1/region/regencies` | List regencies (paginated, filterable) |
| GET | `/api/v1/region/regencies/:id` | Get regency by ID |
| PATCH | `/api/v1/region/regencies/:id` | Update regency |
| DELETE | `/api/v1/region/regencies/:id` | Delete regency |

### Query params (list endpoints)

- `page` (default 1), `limit` (default 10, max 50)
- `filters` — JSON string, e.g. `{"search":"jawa"}` (provinces) or `{"provinceId":1,"type":"kota"}` (regencies)
- `sort` — JSON array, e.g. `[{"orderBy":"name","order":"ASC"}]`
- Convenience: `?province_id=1` on `/regencies` for quick filtering
