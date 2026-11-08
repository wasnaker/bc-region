import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegencyCode1793710213000 implements MigrationInterface {
  name = 'AddRegencyCode1793710213000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn("regency", "code"))) {
      await queryRunner.query(
        `ALTER TABLE "regency" ADD "code" character varying`,
      );
    }
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_regency_code" ON "regency" ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."UQ_regency_code"`);
    if (await queryRunner.hasColumn("regency", "code")) {
      await queryRunner.query(`ALTER TABLE "regency" DROP COLUMN "code"`);
    }
  }
}
