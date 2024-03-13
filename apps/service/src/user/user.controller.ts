import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Ip,
  Post,
  Query,
  Headers,
  Res,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequireLogin, UserInfo } from 'src/decorators/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserListVo } from './vo/user-list.vo';
import { Response, Request } from 'express';
@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  // 注入用户模块的服务
  constructor(private readonly userService: UserService) { }

  /**
   * 普通用户注册接口路由
   * @param registerUser 注册接口请求参数格式
   * @returns
   */
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  /**
   * 普通用户登录接口路由
   * @param loginUser 登录接口请求参数格式
   * @param ip 客户端ip
   * @param origin 客户端origin
   * @param ua 客户端ua
   * @returns
   */
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo,
  })
  @Post('login')
  async userLogin(
    @Body() loginUser: LoginUserDto,
    @Ip() ip: string,
    @Headers('Origin') origin: string,
    @Headers('User-Agent') ua: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const vo = await this.userService.login(
      loginUser,
      false,
      {
        ip,
        origin,
        ua,
      },
      res,
    );
    return vo;
  }

  @Post('logOut')
  async logOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.userService.logOut(req, res);
  }

  /**
   * 普通用户刷新短token接口路由
   * @param refreshToken 刷新 token
   * @returns
   */
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxxxxxxxyyyyyyyyzzzzz',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('refresh')
  async refresh(
    @Query('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const cookie = req.cookies.refreshToken;
    if (cookie) {
      refreshToken = cookie;
    }
    console.log(refreshToken);
    const newToken = await this.userService.refresh(refreshToken, false, res);
    return newToken;
  }

  /**
   * 管理员登录接口路由
   * @param loginUser 登录接口请求参数格式
   * @param ip 客户端ip
   * @param origin 客户端origin
   * @param ua 客户端ua
   * @returns
   */
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo,
  })
  @Post('admin/login')
  async adminLogin(
    @Body() loginUser: LoginUserDto,
    @Ip() ip: string,
    @Headers('Origin') origin: string,
    @Headers('User-Agent') ua: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const vo = await this.userService.login(
      loginUser,
      true,
      {
        ip,
        origin,
        ua,
      },
      res,
    );
    return vo;
  }

  /**
   * 管理员刷新短token接口路由
   * @param refreshToken 刷新 token
   * @returns
   */
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxxxxxxxyyyyyyyyzzzzz',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('admin/refresh')
  async adminRefresh(
    @Query('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const cookie = req.cookies.refreshToken;
    if (cookie) {
      refreshToken = cookie;
    }
    const newToken = await this.userService.refresh(refreshToken, true, res);
    return newToken;
  }

  /**
   * 获取用户信息接口路由
   * @param userId 用户ID
   * @returns
   */
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    type: Number,
    description: '用户ID',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserDetailVo,
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: string) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.nickName = user.nickName;
    vo.email = user.email;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.isFrozen = user.isFrozen;
    vo.createTime = user.createTime;

    return vo;
  }

  /**
   * 修改密码接口路由
   * @param passwordDto 修改密码接口请求参数格式
   * @returns
   */
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiResponse({
    type: String,
    description: '验证码已失效/不正确',
  })
  @Post(['update_password', 'admin/update_password'])
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(passwordDto);
  }

  /**
   * 修改用户信息接口路由
   * @param userId 用户ID
   * @param updateUserDto 修改用户信息接口请求参数格式
   * @returns
   */
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String,
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  /**
   * 用户冻结接口路由
   * @param userId 用户ID
   * @returns
   */
  @ApiBearerAuth()
  @Get('freeze')
  @RequireLogin()
  async freeze(@Query('id') userId: string) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  /**
   * 获取用户列表
   * @param pageNo 第几页
   * @param pageSize 每页多少条
   * @param username 用户名
   * @param nickName 昵称
   * @param email 邮箱地址
   * @returns
   */
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number,
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    type: String,
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称',
    type: String,
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: String,
  })
  @ApiResponse({
    type: UserListVo,
    description: '用户列表',
  })
  @Get('list')
  @RequireLogin()
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUsers(
      username,
      nickName,
      email,
      pageNo,
      pageSize,
    );
  }

  /**
   * 初始化数据接口路由
   * @returns
   */
  @Get('init-data')
  async initData() {
    return await this.userService.initData();
  }
}
