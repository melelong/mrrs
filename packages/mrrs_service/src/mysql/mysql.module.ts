import { Global, Module } from '@nestjs/common';
import { MysqlService } from './mysql.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// 引入你的实体
import { Permission } from 'src/user/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/entities/role.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const dataSourceOptions: MysqlConnectionOptions = {
  type: 'mysql',
  // host: '192.168.3.3',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'Aa123456',
  synchronize: true,
  logging: true,
  poolSize: 10,
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
};
const database = 'mrrs'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // 创建没有指定数据库的数据源
        const masterDataSource = new DataSource(dataSourceOptions);

        // 初始化主数据源来检查数据库是否存在
        await masterDataSource.initialize();

        // 检查数据库是否存在
        const hasDatabase = await masterDataSource.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${database}';`);
        if (hasDatabase.length === 0) {
          await masterDataSource.query(`CREATE DATABASE IF NOT EXISTS ${database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        }

        // 销毁主数据源
        await masterDataSource.destroy();

        // 创建新的数据源并指定数据库
        const appDataSource = new DataSource({
          ...dataSourceOptions,
          database, // 现在指定数据库名称
          entities: [User, Role, Permission],
        });

        // 初始化应用数据源
        await appDataSource.initialize();

        // 返回应用数据源的配置
        return appDataSource.options;
      },
    }),
  ],
  providers: [MysqlService],
  exports: [MysqlService],
})
export class MysqlModule { }
