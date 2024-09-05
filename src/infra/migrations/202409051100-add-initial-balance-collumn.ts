import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddInitialBalanceToFinancialAccount1725547806000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'financial_account',
      new TableColumn({
        name: 'initial_balance',
        type: 'int',
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('financial_account', 'initial_balance');
  }
}
