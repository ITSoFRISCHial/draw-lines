'use client';

import { useState, useEffect, useCallback } from 'react';
import db from '@/lib/db';
import type { Drawing } from '@/types';

export function useDrawings() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const all = await db.drawings.orderBy('createdAt').toArray();
    setDrawings(all);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveDrawing = useCallback(async (drawing: Omit<Drawing, 'id'>) => {
    const id = await db.drawings.add(drawing as Drawing);
    await refresh();
    return id;
  }, [refresh]);

  const deleteDrawing = useCallback(async (id: number) => {
    await db.drawings.delete(id);
    await refresh();
  }, [refresh]);

  return { drawings, loaded, saveDrawing, deleteDrawing, refresh };
}
