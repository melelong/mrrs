import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';

@Injectable()
export class UserService {
  // 导入用户表的操作对象
  @InjectRepository(User)
  private userRepository: Repository<User>;

  // 导入角色表的操作对象
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  // 导入权限表的操作对象
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  // 导入日志服务
  private logger = new Logger();

  // 导入redis服务
  @Inject(RedisService)
  private redisService: RedisService;

  // 注册服务
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    console.log(captcha);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  // 登录服务
  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
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
    return vo;
  }

  // 查询单个用户服务
  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
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

  // 初始化数据服务
  async initData() {
    try {
      const user1 = new User();
      user1.username = 'zhangsan';
      user1.password = md5('111111');
      user1.email = 'xxx@xx.com';
      user1.isAdmin = true;
      user1.nickName = '张三';
      user1.phoneNumber = '13233323333';

      const user2 = new User();
      user2.username = 'lisi';
      user2.password = md5('222222');
      user2.email = 'yy@yy.com';
      user2.nickName = '李四';

      const role1 = new Role();
      role1.name = '管理员';

      const role2 = new Role();
      role2.name = '普通用户';

      const permission1 = new Permission();
      permission1.code = 'ccc';
      permission1.description = '访问 ccc 接口';

      const permission2 = new Permission();
      permission2.code = 'ddd';
      permission2.description = '访问 ddd 接口';

      user1.roles = [role1];
      user2.roles = [role2];

      role1.permissions = [permission1, permission2];
      role2.permissions = [permission1];

      await this.permissionRepository.save([permission1, permission2]);
      await this.roleRepository.save([role1, role2]);
      await this.userRepository.save([user1, user2]);

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
