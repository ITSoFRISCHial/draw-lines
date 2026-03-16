'use client';

import { useState, useEffect, useCallback } from 'react';
import { ROOM_STATE_KEY, PAINTINGS_PER_ROOM } from '@/lib/constants';
import type { RoomState } from '@/types';

const DEFAULT_STATE: RoomState = { currentRoom: 0, unlockedRooms: 1 };

export function useRoomState(drawingCount: number) {
  const [state, setState] = useState<RoomState>(DEFAULT_STATE);

  useEffect(() => {
    const stored = localStorage.getItem(ROOM_STATE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  // Auto-unlock rooms based on drawing count
  useEffect(() => {
    const neededRooms = Math.max(1, Math.ceil(drawingCount / PAINTINGS_PER_ROOM));
    if (neededRooms > state.unlockedRooms) {
      const newState = { ...state, unlockedRooms: neededRooms };
      setState(newState);
      localStorage.setItem(ROOM_STATE_KEY, JSON.stringify(newState));
    }
  }, [drawingCount, state]);

  const setCurrentRoom = useCallback((room: number) => {
    setState(prev => {
      const newState = { ...prev, currentRoom: room };
      localStorage.setItem(ROOM_STATE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  return { ...state, setCurrentRoom };
}
