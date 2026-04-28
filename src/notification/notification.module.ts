import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

import { Notification } from './entities/notification.entity';
import { UserNotification } from './entities/userNotification.entity';
import { UserGroup } from './entities/userGroup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, UserNotification, UserGroup]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
