import Dexie, { type EntityTable } from 'dexie';
import type { Drawing } from '@/types';

const db = new Dexie('DrawLinesDB') as Dexie & {
  drawings: EntityTable<Drawing, 'id'>;
};

db.version(1).stores({
  drawings: '++id, createdAt',
});

export default db;
