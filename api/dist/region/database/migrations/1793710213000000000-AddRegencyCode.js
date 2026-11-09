"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRegencyCode1793710213000 = void 0;
class AddRegencyCode1793710213000 {
    constructor() {
        this.name = 'AddRegencyCode1793710213000';
    }
    async up(queryRunner) {
        if (!(await queryRunner.hasColumn("regency", "code"))) {
            await queryRunner.query(`ALTER TABLE "regency" ADD "code" character varying`);
        }
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_regency_code" ON "regency" ("code")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."UQ_regency_code"`);
        if (await queryRunner.hasColumn("regency", "code")) {
            await queryRunner.query(`ALTER TABLE "regency" DROP COLUMN "code"`);
        }
    }
}
exports.AddRegencyCode1793710213000 = AddRegencyCode1793710213000;
