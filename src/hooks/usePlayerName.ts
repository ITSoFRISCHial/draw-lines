'use client';

import { useState, useEffect, useCallback } from 'react';
import { PLAYER_NAME_KEY } from '@/lib/constants';

export function usePlayerName() {
  const [name, setNameState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PLAYER_NAME_KEY);
    setNameState(stored);
    setLoaded(true);
  }, []);

  const setName = useCallback((newName: string) => {
    localStorage.setItem(PLAYER_NAME_KEY, newName);
    setNameState(newName);
  }, []);

  return { name, loaded, setName };
}
