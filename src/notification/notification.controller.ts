import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user?.id as any; // Assuming you have authentication and user info in the request
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.notificationService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.notificationService.markAsRead(userId, id);
  }
  @Get('unread/count')
  getUnreadCount(@Req() req) {
    const userId = req.user.id;
    return this.notificationService.getUnreadCount(userId);
  }
}
