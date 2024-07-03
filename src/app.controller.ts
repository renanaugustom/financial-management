import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from '@src/auth/auth.guard';

@Controller()
export class AppController {
  @Get('/')
  @ApiOperation({ summary: 'Check app health', tags: ['Health Check'] })
  @Public()
  healthCheck(): string {
    return 'ok';
  }
}
