import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';

export default class Issue extends Model {
  static table = 'issues';
  static associations = {
    projects: { type: 'belongs_to', key: 'project_id' },
  } as const;

  @text('title') title: string;
  @text('description') description: string;
  @text('status') status: string;
  @text('priority') priority: string;
  @date('due_date') dueDate?: Date;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;

  @relation('projects', 'project_id') project: any;
}
