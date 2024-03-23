import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddCreditCardFK1710938982000 implements MigrationInterface {
  creditCardIdFK = new TableForeignKey({
    name: 'creditCardFK',
    columnNames: ['credit_card_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'credit_card',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  creditCardIdColumn = new TableColumn({
    name: 'credit_card_id',
    type: 'uuid',
    isNullable: true,
  });

  creditCardIdIndex = new TableIndex({
    name: 'creditCardIdx',
    columnNames: ['credit_card_id'],
  })

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('transaction', this.creditCardIdColumn);
    await queryRunner.createForeignKey('transaction', this.creditCardIdFK);
    await queryRunner.createIndex('transaction', this.creditCardIdIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('transaction', this.creditCardIdIndex);
    await queryRunner.dropForeignKey('transaction', this.creditCardIdFK);
    await queryRunner.dropColumn('transaction', this.creditCardIdColumn);
  }
}
