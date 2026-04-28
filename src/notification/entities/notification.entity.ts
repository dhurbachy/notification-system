import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
export enum NotificationType {
  USER = 'user',
  GROUP = 'group',
  GLOBAL = 'global',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'uuid', nullable: true })
  recipientId: string;

  @Column({ type: 'uuid', nullable: true })
  actorId: string;

  @Column({ nullable: true })
  entityType: string;

  @Column({ nullable: true })
  entity_id: string;

  @CreateDateColumn()
  created_at: Date;
}
