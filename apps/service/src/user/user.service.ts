import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSalt, md5 } from 'src/utils';
import { Like, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserListVo } from './vo/user-list.vo';
interface HashOptions {
  ip: string;
  origin: string;
  ua: string;
}
@Injectable()
export class UserService {
  // 注入用户表的操作对象
  @InjectRepository(User)
  private userRepository: Repository<User>;

  // 注入角色表的操作对象
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  // 注入权限表的操作对象
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  // 导入日志服务
  private logger = new Logger();

  // 注入redis服务
  @Inject(RedisService)
  private redisService: RedisService;
  // 注入jwt服务
  @Inject(JwtService)
  private jwtService: JwtService;

  // 注入配置服务
  @Inject(ConfigService)
  private configService: ConfigService;

  // 盐
  private salt: CryptoJS.lib.WordArray;

  async setSalt() {
    this.salt = getSalt(await this.configService.get('nest_server').salt);
  }
  /**
   * 注册服务
   * @param user 注册接口请求参数格式
   * @returns
   */
  async register(user: RegisterUserDto) {
    await this.setSalt();
    // 从redis中查找邮箱验证码的缓存
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    console.log(captcha);
    if (!captcha) {
      // 没找到
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      // 和前端传的不一样
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    // 查找用户
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      // 用户已存在
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    // 实例化用户对象
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = await md5(user.password, this.salt);
    newUser.email = user.email;
    newUser.nickName = user.nickName;
    newUser.isAdmin = false;

    try {
      // 保存到用户表中
      await this.userRepository.save(newUser);
      await this.redisService.delete(`captcha_${user.email}`);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  /**
   * 登录服务
   * @param loginUserDto 登录接口请求参数格式
   * @param isAdmin 是否为管理员
   * @param hashOptions 生成hash的选项
   * @returns
   */
  async login(
    loginUserDto: LoginUserDto,
    isAdmin: boolean,
    hashOptions: HashOptions,
  ) {
    await this.setSalt();
    const typeName = `${isAdmin ? 'admin' : 'user'}`;
    const { ip, origin, ua } = hashOptions;
    const hash = await md5(`${ip}_${origin}_${ua}_${typeName}`, this.salt);
    // 联表查询用户信息
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      // 角色表和角色权限表
      relations: ['roles', 'roles.permissions'],
    });
    // 对比用户
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    // 对比密码
    if (user.password !== (await md5(loginUserDto.password, this.salt))) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    try {
      // 对比验证码,统一转成小写，不区分大小写
      const captchaName = `${typeName}_login_${hash.substring(0, 8)}`;
      const captcha: string = await this.redisService.get(captchaName);
      if (captcha.toLowerCase() !== loginUserDto.captcha.toLowerCase()) {
        throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
      }
      this.redisService.delete(captchaName);
    } catch (e) {
      throw new HttpException('验证码过期', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
    // 生成短token
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_server').access_token_expires_time ||
          '30m',
      },
    );
    // 生成长token
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_server').refresh_token_expres_time ||
          '7d',
      },
    );
    return vo;
  }

  /**
   * 查询单个用户服务
   * @param userId 用户ID
   * @param isAdmin 是否为管理员
   * @returns
   */
  async findUserById(userId: number, isAdmin: boolean) {
    // 联表查询用户信息
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      // 角色表和角色权限表
      relations: ['roles', 'roles.permissions'],
    });
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  /**
   * 刷新token
   * @param refreshToken 刷新 Token
   * @param isAdmin 是否为管理员
   * @returns
   */
  async refresh(refreshToken: string, isAdmin: boolean) {
    try {
      // 解析token获取用户数据
      const data = this.jwtService.verify(refreshToken);
      // 根据用户ID查找用户
      const user = await this.findUserById(data.userId, isAdmin);
      // 重新生成短token
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_server').access_token_expires_time ||
            '30m',
        },
      );
      // 重新生成长token
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_server').refresh_token_expres_time ||
            '7d',
        },
      );
      const vo = new RefreshTokenVo();
      vo.access_token = access_token;
      vo.refresh_token = refresh_token;
      return vo;
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  /**
   * 查找用户信息
   * @param userId 用户ID
   * @returns
   */
  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return user;
  }

  /**
   * 修改密码
   * @param userId 用户ID
   * @param passwordDto 修改密码接口请求参数格式
   * @returns
   */
  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    // 查找redis中的验证码缓存
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: passwordDto.username,
    });

    if (foundUser.email !== passwordDto.email) {
      throw new HttpException('邮箱不正确', HttpStatus.BAD_REQUEST);
    }

    foundUser.password = await md5(passwordDto.password, this.salt);

    try {
      await this.userRepository.save(foundUser);
      await this.redisService.delete(
        `update_password_captcha_${passwordDto.email}`,
      );
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
  }

  /**
   * 修改信息
   * @param userId 用户ID
   * @param updateUserDto 修改用户信息接口请求参数格式
   * @returns
   */
  async update(userId: number, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(
      `update_user_captcha_${updateUserDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    if (updateUserDto.nickName) {
      foundUser.nickName = updateUserDto.nickName;
    }
    if (updateUserDto.headPic) {
      foundUser.headPic = updateUserDto.headPic;
    }

    try {
      await this.userRepository.save(foundUser);
      await this.redisService.delete(
        `update_user_captcha_${updateUserDto.email}`,
      );
      return '用户信息修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '用户信息修改成功';
    }
  }

  /**
   * 冻结用户
   * @param id 用户ID
   */
  async freezeUserById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    user.isFrozen = true;
    await this.userRepository.save(user);
  }

  /**
   * 分页查询
   * @param pageNo 第几页
   * @param pageSize 每页多少条
   * @returns
   */
  async findUsersByPage(pageNo: number, pageSize: number) {
    const skipCount = (pageNo - 1) * pageSize;

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'username',
        'nickName',
        'email',
        'phoneNumber',
        'isFrozen',
        'headPic',
        'createTime',
      ],
      skip: skipCount,
      take: pageSize,
    });

    return {
      users,
      totalCount,
    };
  }

  /**
   * 查询用户
   * @param username 用户名
   * @param nickName 昵称
   * @param email 邮箱地址
   * @param pageNo 第几页
   * @param pageSize 每页多少条
   * @returns
   */
  async findUsers(
    username: string,
    nickName: string,
    email: string,
    pageNo: number,
    pageSize: number,
  ) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (username) {
      condition.username = Like(`%${username}%`);
    }
    if (nickName) {
      condition.nickName = Like(`%${nickName}%`);
    }
    if (email) {
      condition.email = Like(`%${email}%`);
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'username',
        'nickName',
        'email',
        'phoneNumber',
        'isFrozen',
        'headPic',
        'createTime',
      ],
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    const vo = new UserListVo();
    vo.users = users;
    vo.totalCount = totalCount;
    return vo;
  }

  /**
   * 初始化数据服务
   * @returns
   */
  async initData() {
    try {
      await this.setSalt();
      const user1 = new User();
      user1.username = 'melelong';
      user1.password = await md5('11111111', this.salt);
      user1.email = '1137042726@qq.com';
      user1.isAdmin = true;
      user1.nickName = 'melelong';
      user1.phoneNumber = '15219764231';

      const role1 = new Role();
      role1.name = 'admin';

      const role2 = new Role();
      role2.name = 'user';

      const permission1 = new Permission();
      permission1.code = 'ccc';
      permission1.description = '访问 ccc 接口';

      const permission2 = new Permission();
      permission2.code = 'ddd';
      permission2.description = '访问 ddd 接口';

      user1.roles = [role1];

      role1.permissions = [permission1, permission2];
      role2.permissions = [permission1];

      await this.permissionRepository.save([permission1, permission2]);
      await this.roleRepository.save([role1, role2]);
      await this.userRepository.save([user1]);

      return {
        code: 200,
        msg: '初始化成功',
      };
    } catch (e) {
      this.logger.error(e, UserService);
      throw new HttpException('初始化失败', HttpStatus.BAD_REQUEST);
    }
  }
}
