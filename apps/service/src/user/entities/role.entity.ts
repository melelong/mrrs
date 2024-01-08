import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
// 角色表结构
@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '角色名',
  })
  name: string;
  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  // 创建中间表role_permissions
  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];
}
