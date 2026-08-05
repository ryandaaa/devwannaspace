import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation, children } from '@nozbe/watermelondb/decorators';

export default class Page extends Model {
  static table = 'pages';
  static associations = {
    projects: { type: 'belongs_to', key: 'project_id' },
    pages: { type: 'belongs_to', key: 'parent_id' }, // Self-referential parent
  } as const;

  @text('title') title: string;
  @text('icon') icon?: string;
  @text('content') content?: string; // Stored as JSON string
  @field('is_favorite') isFavorite: boolean;
  @field('is_deleted') isDeleted: boolean;
  @text('cover_color') coverColor?: string;
  @text('project_id') projectId?: string;
  @field('position') position?: number;
  @date('created_at') createdAt: Date;
  @date('updated_at') updatedAt: Date;

  @relation('projects', 'project_id') project: any;
  @relation('pages', 'parent_id') parentPage: any;

  get isStarred(): boolean {
    return this.isFavorite;
  }

  async toggleFavorite() {
    await this.database.write(async () => {
      await this.update((p) => {
        p.isFavorite = !this.isFavorite;
      });
    });
  }

  async deletePage() {
    await this.database.write(async () => {
      await this.update((p) => {
        p.isDeleted = true;
      });
    });
  }
}
