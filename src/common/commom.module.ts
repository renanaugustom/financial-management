import { Module } from '@nestjs/common';
import { UtilsService } from '@src/common/utils.service';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
})
export class CommonModule {}
