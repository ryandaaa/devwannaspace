import { synchronize } from '@nozbe/watermelondb/sync';
import { db } from './index';

const API_BASE = 'https://api.ryanda-valents3649.workers.dev/api';

let activeSyncPromise: Promise<void> | null = null;

export async function sync(getToken: () => Promise<string | null>) {
  if (activeSyncPromise) {
    try {
      await activeSyncPromise;
    } catch {}
    return;
  }

  activeSyncPromise = (async () => {
    try {
      const token = await getToken();
      if (!token) return;

      await synchronize({
        database: db,
        pullChanges: async ({ lastPulledAt }) => {
          const response = await fetch(`${API_BASE}/sync?since=${lastPulledAt || 0}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (!response.ok) {
            throw new Error(`Failed to pull changes: ${response.statusText}`);
          }

          const { changes, timestamp } = await response.json();
          return { changes, timestamp };
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
          const response = await fetch(`${API_BASE}/sync`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ changes, lastPulledAt }),
          });

          if (!response.ok) {
            throw new Error(`Failed to push changes: ${response.statusText}`);
          }
        },
      });
    } catch (err: any) {
      if (err?.message?.includes('concurrent synchronization')) {
        // Silently catch concurrent sync notice if WatermelonDB engine is already running
        return;
      }
      console.warn('Sync notice:', err?.message || err);
    }
  })();

  try {
    await activeSyncPromise;
  } finally {
    activeSyncPromise = null;
  }
}
