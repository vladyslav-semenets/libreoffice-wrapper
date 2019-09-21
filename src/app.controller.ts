import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get('/api/health-check')
  healthCheck(@Req() request: Request, @Res() response: Response) {
    response.json({ status: 'ok' });
  }
}
