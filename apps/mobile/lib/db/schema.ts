import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'projects',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'issues',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'priority', type: 'string' },
        { name: 'project_id', type: 'string', isIndexed: true },
        { name: 'due_date', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'pages',
      columns: [
        { name: 'parent_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'content', type: 'string', isOptional: true }, // Store as stringified JSON
        { name: 'is_favorite', type: 'boolean' },
        { name: 'is_deleted', type: 'boolean' },
        { name: 'cover_color', type: 'string', isOptional: true },
        { name: 'project_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'position', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'notifications',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'message', type: 'string' },
        { name: 'is_read', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
