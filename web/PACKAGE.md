# Frontend package

Frontend module Region dipublikasikan sebagai package `@wasnaker/module-region`.
Repository ini tetap menjadi satu-satunya source of truth; host tidak boleh
menyalin atau mengedit isi package.

## Release

1. Naikkan `version` pada `package.json`.
2. Buat tag `region-web-v<version>` pada commit yang akan dirilis.
3. Pastikan repository secret `NPM_TOKEN` tersedia.
4. GitHub Actions akan menerbitkan package ke npm.

## Konsumsi oleh host

Host memasang versi package secara eksplisit dan memasukkannya ke
`transpilePackages` Next.js. Manifest diimpor dari
`@wasnaker/module-region/manifest`; komponen halaman dari
`@wasnaker/module-region`. Resource bahasa tersedia melalui subpath
`@wasnaker/module-region/locales/<language>`.

Package sengaja menerbitkan source TypeScript, bukan bundle mandiri, karena
module menggunakan komponen, API client, routing, dan autentikasi milik host.
Karena itu host harus menyediakan peer dependencies dan alias `@/*`.
