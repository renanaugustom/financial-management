import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddTableTransaction1706904237000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'financial_account_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'category_id',
            type: 'uuid',
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
          {
            name: 'categoryIdFK',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'category',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          { columnNames: ['date'] },
          { columnNames: ['type'] },
          { columnNames: ['category_id'] },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
