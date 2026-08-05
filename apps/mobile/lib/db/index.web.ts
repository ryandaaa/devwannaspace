import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import schema from './schema';
import Project from './models/Project';
import Issue from './models/Issue';
import Page from './models/Page';
import NotificationItem from './models/NotificationItem';

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  onSetUpError: error => {
    console.error('WatermelonDB (LokiJS) setup error', error);
  }
});

export const db = new Database({
  adapter,
  modelClasses: [Project, Issue, Page, NotificationItem],
});
