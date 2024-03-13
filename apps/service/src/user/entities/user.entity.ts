import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { v4 } from 'uuid';
/**
 * 用户表结构
 */
@Entity({
  name: 'users',
})
export class User {
  constructor() {
    this.id = v4();
  }

  @PrimaryColumn('uuid')
  id: string;

  @Column({
    length: 50,
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
  })
  nickName: string;

  @Column({
    comment: '邮箱',
    length: 50,
  })
  email: string;

  @Column({
    comment: '头像',
    length: 100,
    nullable: true,
  })
  headPic: string;

  @Column({
    comment: '手机号',
    length: 20,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    comment: '是否冻结',
    default: false,
  })
  isFrozen: boolean;

  @Column({
    comment: '是否是管理员',
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updateTime: Date;

  // 创建中间表user_roles
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
