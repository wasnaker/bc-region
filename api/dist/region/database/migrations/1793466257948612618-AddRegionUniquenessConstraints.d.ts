import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddRegionUniquenessConstraints1793466257949 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
