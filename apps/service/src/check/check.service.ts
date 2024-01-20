import { Injectable } from '@nestjs/common';
import { Response } from 'express';
// import { CheckEnvDto } from './dto/check-env.dto';

@Injectable()
export class CheckService {
  async checkEnv(env: any, res: Response) {
    res.cookie('test', '123', {
      httpOnly: true,
    });
    console.log({
      env,
      res: res.cookie,
    });
    return '';
  }
}
