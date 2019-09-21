import { Controller, Post, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import { ConvertService } from './convert.service';

@Controller('/api/convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) { }

  @Post('process')
  public async index(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { file, filename, convertTo } = request.body;

    const result = await this.convertService.process(file, filename, convertTo);

    response.json(result);
  }
}
