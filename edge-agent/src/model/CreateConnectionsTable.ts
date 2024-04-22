// This code is a test which does not work.
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateConnectionsTable1612345678901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "connections",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "createdAt",
                    type: "datetime",
                },
                {
                    name: "alias_created",
                    type: "text",
                },
                {
                    name: "alias_received",
                    type: "text",
                },
                {
                    name: "did_created",
                    type: "text",
                },
                {
                    name: "did_received",
                    type: "text",
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("connections");
    }
}

export const migrations = [
    CreateConnectionsTable1612345678901,
]