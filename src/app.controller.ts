import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/')
  @ApiOperation({ summary: 'Check app health', tags: ['Health Check'] })
  healthCheck(): string {
    return 'ok';
  }
}
