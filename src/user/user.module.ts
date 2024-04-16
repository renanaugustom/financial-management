import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '@src/user/user.service';
import { User } from '@src/user/user.entity';
import { UserController } from '@src/user/user.controller';
import { CommonModule } from '@src/common/commom.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
