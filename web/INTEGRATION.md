# Integrasi Modul Region ke brocoders-react-web

Modul ini source-only — disalin ke host app, bukan dijalankan sendiri.
Path di bawah memakai variabel: `$MODULE` = repo ini, `$HOST_WEB` = root repo `brocoders-react-web`.

## 1. Salin kode modul

```bash
cp -r "$MODULE/web/src/modules/region" "$HOST_WEB/src/modules/region"
```

## 2. Salin terjemahan i18n

```bash
for lang in en id ja ko zh; do
  cp "$MODULE/web/src/services/i18n/locales/$lang/module-region.json" \
     "$HOST_WEB/src/services/i18n/locales/$lang/"
done
```

## 3. Daftarkan manifest + route halaman

Ikuti pola modul `post` — modul dimuat lewat registry core:

- `src/core/modules/registry.ts` — otomatis oleh `node scripts/generate-module-registry.mjs`
  (atau otomatis saat `npm run deploy`).

**Manifest hanya mendaftarkan menu — route halaman tetap harus dibuat** di host
(Next.js tidak bisa generate route dari manifest). Buat 2 file, ikuti pola
`src/app/[language]/admin-panel/roles/`:

`src/app/[language]/admin-panel/region/page.tsx` — server component + metadata:

```tsx
import { getServerTranslation } from "@/services/i18n";
import Region from "./page-content";

export async function generateMetadata(props: {
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "module-region");
  return { title: t("module-region:title") };
}

export default function Page() {
  return <Region />;
}
```

`src/app/[language]/admin-panel/region/page-content.tsx` — gate auth + render modul:

```tsx
"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { RegionPage } from "@/modules/region";

function Region() {
  return <RegionPage />;
}

export default withPageRequiredAuth(Region, { roles: [RoleEnum.ADMIN] });
```

Halaman tersedia di **`/{language}/admin-panel/region`** (menu item `menu` di manifest, position 60).

## 4. Endpoint backend yang dipakai

Semua lewat API_URL host (`/api/v1`):

| Aksi | Endpoint |
|------|----------|
| List provinsi | `GET /v1/region/provinces?page&limit&filters&sort` |
| Detail provinsi | `GET /v1/region/provinces/:id` |
| Create / Update / Delete | `POST` / `PATCH :id` / `DELETE :id` |
| List kab/kota | `GET /v1/region/regencies?filters={"provinceId":X}` |
| CRUD kab/kota | sama seperti provinsi |

Envelope respons list: `{ data, hasNextPage }` (lihat `api/INTEGRATION.md` di folder backend).

## Pola UI: klik row → panel kanan (SmallTable)

- State `showDetail` (smallView) **di halaman**, bukan di komponen tabel.
- Klik row → `selectItem(id)`: set `selectedId` + `setShowDetail(true)` (auto-expand) + sinkron `window.location.hash`.
- Panel kanan muncul hanya jika `selectedId !== null && showDetail`.
- Saat panel terbuka, tabel hanya menampilkan kolom `primary: true`.
- Toolbar panel: Edit + Delete + toggle ◀/▶.
- CRUD via Dialog terpisah; sukses → `invalidateQueries` → select item baru.

## Verifikasi type-check (opsional)

`web/tsconfig.check.json` extends tsconfig host via **relative path**
(`../../../brocoders-react-web/...`) — asumsi kedua repo berdampingan di
parent yang sama:

```
brocoders/
├── brocoders-modules/bc-region/   ← repo ini
└── brocoders-react-web/           ← host
```

```bash
cd "$MODULE/web"
"$HOST_WEB/node_modules/.bin/tsc" -p tsconfig.check.json
```
