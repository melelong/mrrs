import { ApiProperty } from '@nestjs/swagger';
/**
 * 注册接口响应格式
 */
export class RefreshTokenVo {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
