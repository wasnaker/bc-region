# Integrasi Modul Region ke brocoders-react-web

Modul ini source-only — disalin ke host app, bukan dijalankan sendiri.

## 1. Salin kode modul

```bash
cp -r web/src/modules/region  /www/wwwroot/brocoders/brocoders-react-web/src/modules/region
```

## 2. Salin terjemahan i18n

```bash
for lang in en id ja ko zh; do
  cp web/src/services/i18n/locales/$lang/module-region.json \
     /www/wwwroot/brocoders/brocoders-react-web/src/services/i18n/locales/$lang/
done
```

## 3. Daftarkan manifest

Ikuti pola modul `post` — modul dimuat lewat registry core:

- `src/core/modules/registry.ts` — tambahkan import manifest region.

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
