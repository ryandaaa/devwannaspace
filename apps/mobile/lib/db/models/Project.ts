import { Model } from '@nozbe/watermelondb';
import { field, text, date, children } from '@nozbe/watermelondb/decorators';

export default class Project extends Model {
  static table = 'projects';
  static associations = {
    issues: { type: 'has_many', foreignKey: 'project_id' },
    pages: { type: 'has_many', foreignKey: 'project_id' },
  } as const;

  @text('name') name: string;
  @text('color') color: string;
  @text('description') description?: string;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;

  @children('issues') issues: any;
  @children('pages') pages: any;
}
