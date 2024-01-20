import { Controller, Get, Query, Res } from '@nestjs/common';
import { CheckService } from './check.service';
import { Response } from 'express';
// import { CheckEnvDto } from './dto/check-env.dto';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) { }

  @Get('env')
  async checkEnv(@Query() env: any, @Res({ passthrough: true }) res: Response) {
    return await this.checkService.checkEnv(env, res);
  }
}
