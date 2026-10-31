# bc-region

Modul data referensi wilayah administrasi Indonesia (**Province** & **Regency/Kota**) — 1 repo = 1 module, self-contained, siap diintegrasikan ke host **brocoders** (NestJS + Next.js).

## Isi Repo

```
bc-region/
├── api/               # Backend — NestJS module (TypeORM/MySQL)
│   └── src/
│       ├── region/
│       │   ├── domain/                  # Province, Regency (model + enum)
│       │   ├── dto/                     # Create/Update/Query DTOs
│       │   ├── services/                # RegionService (CRUD keduanya)
│       │   ├── controllers/             # RegionController (REST /api/v1/region/*)
│       │   ├── infrastructure/
│       │   │   └── persistence/
│       │   │       ├── *.repository.ts  # Abstract repository interfaces
│       │   │       └── relational/      # TypeORM: entities, mappers, repositories
│       │   └── region.module.ts
│       └── utils/                       # Helper bersama (pagination, types)
├── web/               # Frontend — React module (shadcn/ui + TanStack Query)
│   └── src/
│       ├── modules/region/
│       │   ├── components/              # SmallTable (panel kanan), form dialogs, tabs
│       │   ├── hooks/                   # React Query hooks
│       │   ├── pages/                   # RegionPage (/admin-panel/region)
│       │   ├── services/                # API services (useFetch pattern host)
│       │   ├── types/                   # Province, Regency, REGENCY_TYPES
│       │   ├── module.manifest.ts       # Menu admin-panel
│       │   └── index.ts
│       └── services/i18n/locales/{en,id,ja,ko,zh}/module-region.json
├── api/INTEGRATION.md   # Cara integrasi backend ke brocoders-api
└── web/INTEGRATION.md   # Cara integrasi frontend ke brocoders-react-web
```

## Endpoint API (prefix `/api/v1/region`)

| Method | Path | Keterangan |
|--------|------|-----------|
| GET | `/provinces` | List + pagination (`?page&limit&filters&sort`) |
| GET | `/provinces/:id` | Detail |
| POST / PATCH / DELETE | `/provinces[/:id]` | CRUD (delete → regencies ikut terhapus) |
| GET | `/regencies` | List + filter `provinceId`, `type` |
| GET | `/regencies/:id` | Detail |
| POST / PATCH / DELETE | `/regencies[/:id]` | CRUD (validasi province exists) |

## Pola UI: Klik Row → Panel Kanan (SmallTable)

Diporting dari pola `wasnaker-frontend`, ditulis ulang dengan stack `brocoders-react-web` (shadcn/ui + TanStack Query + semantic classes):

- **State `showDetail` di halaman**, bukan di komponen tabel — panel dikontrol penuh parent.
- Klik row → set `selectedId` + `setShowDetail(true)` (auto-expand) + sinkron `window.location.hash`.
- Panel kanan (`lg:w-7/12`): header + toolbar (Edit/Delete/toggle ◀▶) + tabs (Overview, Kab/Kota).
- Saat panel terbuka, tabel menyusut ke `lg:w-5/12` dan hanya menampilkan kolom `primary: true`.
- CRUD via Dialog terpisah; sukses → `invalidateQueries` → auto-select item tersimpan.

## Integrasi

Lihat [`api/INTEGRATION.md`](api/INTEGRATION.md) dan [`web/INTEGRATION.md`](web/INTEGRATION.md).

## License

[GNU General Public License v2](LICENSE)
