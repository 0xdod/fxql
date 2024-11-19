import { MigrationInterface, QueryRunner } from "typeorm";

export class FXQLStatement1732045374212 implements MigrationInterface {
    name = 'FXQLStatement1732045374212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fxql_statements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sourceCurrency" character varying(3) NOT NULL, "destinationCurrency" character varying(3) NOT NULL, "sellPrice" numeric(10,2) NOT NULL, "buyPrice" numeric(10,2) NOT NULL, "capAmount" integer NOT NULL, CONSTRAINT "UQ_def66904d0ebe19accb24c3c157" UNIQUE ("sourceCurrency", "destinationCurrency"), CONSTRAINT "PK_515dff699e2c7174f604d7f3c05" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fxql_statements"`);
    }

}
