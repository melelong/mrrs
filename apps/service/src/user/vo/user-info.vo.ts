import { ApiProperty } from '@nestjs/swagger';

export class UserDetailVo {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'zhangsan' })
  username: string;

  @ApiProperty({ example: '张三' })
  nickName: string;

  @ApiProperty({ example: 'xx@xx.com' })
  email: string;

  @ApiProperty({ example: 'xxx.png' })
  headPic: string;

  @ApiProperty({ example: '13233333333' })
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  createTime: Date;
}
