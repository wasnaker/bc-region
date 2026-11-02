# Backend package

The backend capability is built as CommonJS JavaScript plus TypeScript declarations.
This is intentional: the current NestJS host compiles to CommonJS, while the web
entry point remains TypeScript source consumed by Next.js `transpilePackages`.

## Install

```bash
npm install github:wasnaker/bc-region#<immutable-commit-sha>
```

Pin an immutable commit SHA in both `package.json` and `package-lock.json`.
The Git dependency runs `prepare` and builds `api/dist` before installation.

## Register in NestJS

```ts
import { RegionModule } from '@wasnaker/module-region/api';
import { RoleEnum } from './roles/roles.enum';

@Module({
  imports: [RegionModule.register({ adminRoleIds: [RoleEnum.admin] })],
})
export class AppModule {}
```

The host owns the PostgreSQL connection and authentication strategy named `jwt`.
The module owns its entities, repositories, services, controllers, DTOs and seed data.
Write access is delegated to the host's configured role IDs; if no IDs are
configured, writes are denied.

## Migrations

Register the exported migration class explicitly in the host TypeORM DataSource:

```ts
import { CreateRegion1793466257948612617 } from
  '@wasnaker/module-region/api/migrations';

migrations: [
  CreateRegion1793466257948612617,
  ...existingMigrations,
]
```

Do not copy module source, entities, migrations, or seeds into the host repository.
The host migration runner executes module migrations against the host PostgreSQL
DataSource. Seed execution remains an explicit host lifecycle operation.

## Build locally

```bash
npm run build:api
```
