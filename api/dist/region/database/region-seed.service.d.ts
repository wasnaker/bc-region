import { Repository } from 'typeorm';
import { ProvinceEntity } from '../infrastructure/persistence/relational/entities/province.entity';
import { RegencyEntity } from '../infrastructure/persistence/relational/entities/regency.entity';
/**
 * Seed data wilayah administrasi Indonesia.
 *
 * Sumber: fityannugroho/idn-area-data (berbasis Kemendagri) — 38 provinsi,
 * 514 kab/kota (98 kota). Nama kab/kota menyertakan prefix "Kabupaten "/"Kota "
 * sesuai data resmi; field `type` diisi dari prefix tersebut.
 *
 * IDEMPOTENT:
 * - Province di-upsert by `isoCode` (nama ikut diperbarui bila berubah).
 * - Regency di-insert hanya bila (provinceId, name) belum ada — aman
 *   dijalankan berulang dan tidak menimpa editan manual.
 *
 * Koordinat (latitude/longitude) tidak tersedia dari sumber ini — dibiarkan
 * NULL dan bisa diisi manual via panel admin.
 */
export declare class RegionSeedService {
    private readonly provinceRepository;
    private readonly regencyRepository;
    private readonly logger;
    constructor(provinceRepository: Repository<ProvinceEntity>, regencyRepository: Repository<RegencyEntity>);
    run(): Promise<void>;
    private seedProvinces;
    private seedRegencies;
}
