import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddTableCreditCard1710937070000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'credit_card',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'brand',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'limit',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'financial_account_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'invoice_day',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'payment_day',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'financialAccountIdFK',
            columnNames: ['financial_account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'financial_account',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "credit_card"`);
  }
}
