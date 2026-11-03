export declare enum RegencyTypeEnum {
    KABUPATEN = "kabupaten",
    KOTA = "kota"
}
export declare const REGENCY_TYPES: {
    value: RegencyTypeEnum;
    label: string;
}[];
export declare class Regency {
    id: number | string;
    provinceId: number | string;
    name: string;
    type: RegencyTypeEnum;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
