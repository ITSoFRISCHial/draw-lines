export const BRUSH_THICK = 20;
export const BRUSH_THIN = 5;

export const PAINTINGS_PER_ROOM = 6;
export const PAINTINGS_PER_WALL = 3;

export const ROOM_WIDTH = 12;
export const ROOM_DEPTH = 16;
export const ROOM_HEIGHT = 5;

export const CAMERA_HEIGHT = 1.2;

export const TEXTURE_MAX_SIZE = 1024;

export const ICON_SIZE_CLASS = 'w-[min(60px,15vw)] h-[min(60px,15vw)] min-w-[44px] min-h-[44px]';
export const ICON_INNER_CLASS = 'w-[min(36px,9vw)] h-[min(36px,9vw)]';

export const SPARKLE_INTERVAL = 12; // pixels between sparkles

export const STAMPS = [
  { name: 'star', path: '/stamps/star.svg' },
  { name: 'heart', path: '/stamps/heart.svg' },
  { name: 'dinosaur', path: '/stamps/dinosaur.svg' },
  { name: 'moon', path: '/stamps/moon.svg' },
] as const;

export const EMOJIS = [
  '😀', '😂', '🥰', '😎', '🤩',
  '🐶', '🐱', '🦄', '🐸', '🦋',
  '🌈', '⭐', '🔥', '💎', '🎈',
  '🍕', '🍦', '🎸', '🚀', '🎨',
];

export const PLAYER_NAME_KEY = 'draw-lines-player-name';
export const ROOM_STATE_KEY = 'draw-lines-room-state';
