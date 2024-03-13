import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { v4 } from 'uuid';
/**
 * 角色表结构
 */
@Entity({
  name: 'roles',
})
export class Role {
  constructor() {
    this.id = v4();
  }

  @PrimaryColumn('uuid')
  id: string;

  @Column({
    length: 20,
    comment: '角色名',
  })
  name: string;

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

  // 创建中间表role_permissions
  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];
}
