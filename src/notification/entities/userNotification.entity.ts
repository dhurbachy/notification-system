import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
@Entity('user_notifications')
@Unique(['user_id', 'notification_id'])
export class UserNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  notification_id: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  read_at: Date;
}
