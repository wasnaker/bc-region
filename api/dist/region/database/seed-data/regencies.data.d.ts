/** 514 kabupaten/kota Indonesia — sumber: fityannugroho/idn-area-data (Kemendagri). */
export interface RegencySeedRow {
    provinceIsoCode: string;
    name: string;
    type: 'kabupaten' | 'kota';
}
export declare const REGENCY_SEED: RegencySeedRow[];
