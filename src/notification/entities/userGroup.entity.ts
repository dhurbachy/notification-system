import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
@Entity('user_groups')
@Unique(['user_id', 'group_id'])
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  group_id: string;
}
