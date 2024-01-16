import { ApiProperty } from '@nestjs/swagger';
/**
 * 注册接口响应格式
 */
export class RefreshTokenVo {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
