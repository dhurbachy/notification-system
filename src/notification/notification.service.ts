import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';
import { UserNotification } from './entities/userNotification.entity';
import { UserGroup } from './entities/userGroup.entity';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotification)
    private userNotificationRepository: Repository<UserNotification>,
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );

    return await this.notificationRepository.save(notification);
  }

  async findAll(userId: string) {
    return await this.notificationRepository.query(
      `
  SELECT n.*, un.is_read
  FROM notifications n
  LEFT JOIN user_notifications un 
    ON un.notification_id = n.id AND un.user_id = $1::uuid
  WHERE 
    n.type = 'global'
    OR (n.type = 'user' AND n.reference_id = $1)
    OR (
      n.type = 'group' AND n.reference_id IN (
        SELECT group_id FROM user_groups WHERE user_id = $1::uuid
      )
    )
  ORDER BY n.created_at DESC
`,
      [userId],
    );
  }

  async findOne(id: string) {
    return await this.notificationRepository.findOneBy({ id: id.toString() });
  }

  async markAsRead(userId: string, notificationId: string) {
    await this.userNotificationRepository
      .createQueryBuilder()
      .insert()
      .values({
        user_id: userId,
        notification_id: notificationId,
        is_read: true,
      })
      .orUpdate(['is_read', 'read_at'], ['user_id', 'notification_id'])
      .execute();

    return { message: 'Marked as read' };
  }
  async getUnreadCount(userId: string) {
    const result = await this.notificationRepository.query(
      `
    SELECT COUNT(*) as count
    FROM notifications n
    LEFT JOIN user_notifications un
      ON un.notification_id = n.id AND un.user_id = $1
    WHERE
      (n.type = 'global'
       OR (n.type = 'user' AND n.reference_id = $1)
       OR (n.type = 'group' AND n.reference_id IN (
            SELECT group_id FROM user_groups WHERE user_id = $1
          )
       )
      )
      AND (un.is_read IS NULL OR un.is_read = false)
    `,
      [userId],
    );

    return result[0];
  }
}
