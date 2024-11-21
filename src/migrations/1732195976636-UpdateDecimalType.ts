import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDecimalType1732195976636 implements MigrationInterface {
    name = 'UpdateDecimalType1732195976636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fxql_statements" ALTER COLUMN "sellPrice" TYPE numeric(19,8)`);
        await queryRunner.query(`ALTER TABLE "fxql_statements" ALTER COLUMN "buyPrice" TYPE numeric(19,8)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fxql_statements" ALTER COLUMN "buyPrice" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "fxql_statements" ALTER COLUMN "sellPrice" TYPE numeric(10,2)`);
    }

}
