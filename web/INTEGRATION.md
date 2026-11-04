# Integrasi Module Region ke brocoders-react-web

Module Region dipasang sebagai package, bukan disalin ke source host. Repository
ini adalah satu-satunya source of truth untuk halaman, komponen, hooks, service,
manifest, dan resource bahasa Region.

## 1. Pasang package

Dari root `brocoders-react-web`:

```bash
npm run module:add -- region --ref <tag-atau-commit>
```

Perintah tersebut memasang `@wasnaker/module-region` sebagai dependency Git
yang dikunci ke ref yang diberikan, lalu membangkitkan manifest registry dan
registry resource i18n. Jangan menyalin atau mengedit isi package di frontend.

Untuk menghapus:

```bash
npm run module:rm -- region
```

## 2. Halaman dideklarasikan di manifest

Host tidak lagi membutuhkan file route per modul. Halaman admin didaftarkan di
`web/src/modules/region/module.manifest.ts` melalui `pages`:

```ts
pages: [
  {
    path: "/admin/region",
    component: RegionPage,
    title: { namespace: "module-region", key: "title" },
    permission: "read:region",
  },
],
```

Host menyediakan satu route generik
(`src/app/[language]/admin/[...modulePath]/page.tsx` dan varian tanpa locale)
yang:

- mencocokkan URL kanonik ke `pages[].path` lewat `getModulePage()`,
- merender `pages[].component` milik package (tanpa import modul di host),
- memakai `pages[].title` untuk metadata/title dokumen,
- menerapkan `withPageRequiredAuth` (role ADMIN) yang sama untuk semua halaman
  modul.

Tidak ada lagi `src/app/**/admin/region/page.tsx` atau `page-content.tsx` di
host. Menambah halaman baru cukup menambah entri `pages` + key i18n judul, lalu
pin ulang package.

## 3. Kontrak package

- Manifest: `@wasnaker/module-region/manifest`
- Public API halaman/komponen: `@wasnaker/module-region`
- Resource bahasa: `@wasnaker/module-region/locales/<language>`
- Host menyediakan alias `@/*`, auth, API client, routing, UI primitives,
  React Query, dan peer dependencies.
- Host menjalankan `transpilePackages` untuk module packages.
- Manifest dan locale registry dibangkitkan dari dependency package; tidak ada
  source module yang disalin ke `src/modules` atau folder locale host.

## 4. Endpoint API

Semua request menggunakan API_URL host (`/api/v1`):

| Aksi | Endpoint |
|------|----------|
| List provinsi | `GET /v1/region/provinces?page&limit&filters&sort` |
| Detail provinsi | `GET /v1/region/provinces/:id` |
| CRUD provinsi | `POST/PATCH/DELETE /v1/region/provinces` |
| List kab/kota | `GET /v1/region/regencies?filters=...` |
| Detail kab/kota | `GET /v1/region/regencies/:id` |
| CRUD kab/kota | `POST/PATCH/DELETE /v1/region/regencies` |

## 5. Pengembangan lokal

Edit kode hanya di repository `bc-region`. Setelah perubahan diuji, buat
commit/tag baru dan perbarui ref dependency di host. Jangan melakukan hotfix
pada salinan package di repository frontend.
