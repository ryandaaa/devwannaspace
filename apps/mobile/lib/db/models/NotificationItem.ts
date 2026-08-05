import { Model } from '@nozbe/watermelondb';
import { field, text, date } from '@nozbe/watermelondb/decorators';

export default class NotificationItem extends Model {
  static table = 'notifications';

  @text('title') title: string;
  @text('message') message: string;
  @field('is_read') isRead: boolean;
  @date('created_at') createdAt: Date;
}
