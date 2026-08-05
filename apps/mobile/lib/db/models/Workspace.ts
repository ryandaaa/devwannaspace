import { Model } from '@nozbe/watermelondb';
import { text, date } from '@nozbe/watermelondb/decorators';

export default class Workspace extends Model {
  static table = 'workspaces';

  @text('name') name!: string;
  @text('slug') slug?: string;
  @text('icon') icon?: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
