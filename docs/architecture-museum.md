# Museum Gallery Architecture

## Drawing Flow

1. User draws on `/` page using `DrawingCanvas` (Fabric.js canvas, full viewport)
2. On save, `canvas.toDataURL('image/png')` captures the image
3. `saveDrawing()` stores to IndexedDB via Dexie with `{ name, dataUrl, width: window.innerWidth, height: window.innerHeight, createdAt }`
4. `useDrawings` hook fetches all drawings ordered by `createdAt`
5. Museum page (`/museum`) passes drawings to `MuseumScene`
6. `RoomManager` chunks drawings into groups of 6
7. `MuseumRoom` places each drawing in a wall slot
8. `PictureFrame` renders with a Three.js Texture created from `dataUrl`

## 3D Scene Structure

```
MuseumScene (src/components/museum/MuseumScene.tsx)
├── Canvas (@react-three/fiber)
│   ├── Lighting (ambient 0.4 warm + directional 0.6)
│   ├── Fog (warm color, 10-60 units)
│   ├── PlayerController (camera + movement, defined inside MuseumScene for useFrame access)
│   └── RoomManager (src/components/museum/RoomManager.tsx)
│       ├── MuseumEntrance (arch with player name)
│       └── MuseumRoom[] (one per 6 drawings)
│           ├── Floor/Ceiling/Walls (with doorways between rooms)
│           ├── PictureFrame[] (drawings on walls)
│           ├── GalleryBench (seating in room center)
│           └── Doorway (to next room)
└── TouchControls (src/components/museum/TouchControls.tsx)
    └── Mobile touch overlay for camera/movement
```

## Room & Painting Layout

Constants defined in `src/lib/constants.ts`:
```
ROOM_WIDTH = 12, ROOM_DEPTH = 16, ROOM_HEIGHT = 5
PAINTINGS_PER_ROOM = 6 (3 left wall + 3 right wall)
CAMERA_HEIGHT = 1.2
```

- Rooms chain along Z-axis: `roomOffset = [0, 0, roomIndex * ROOM_DEPTH]`
- Paintings spaced evenly along each wall: `spacing = ROOM_DEPTH / (PAINTINGS_PER_WALL + 1)`
- Left wall: `position = [-ROOM_WIDTH/2 + 0.05, paintingHeight, z]`, rotation faces right
- Right wall: `position = [ROOM_WIDTH/2 - 0.05, paintingHeight, z]`, rotation faces left
- Layout logic in `src/lib/museumLayout.ts`

## PictureFrame (src/components/museum/PictureFrame.tsx)

Each painting is a `<group>` containing:
- Back plate (dark box behind the canvas)
- 4 gold border pieces (top, bottom, left, right)
- Canvas plane (Three.js Texture from drawing's dataUrl)
- Point light illuminating the painting

Frame dimensions are computed dynamically from the drawing's aspect ratio to prevent stretching. A `MAX_DIM` constant caps the largest dimension, and the other dimension is scaled to maintain the original aspect ratio.

## Camera Initialization

Camera starts in the room containing the most recent artwork, facing its wall:
```
lastRoomIndex = Math.ceil(drawings.length / PAINTINGS_PER_ROOM) - 1
roomCenterZ = getRoomOffset(lastRoomIndex)[2]
initialPosition = [0, CAMERA_HEIGHT, roomCenterZ]
lastSlotIndex = (drawings.length - 1) % PAINTINGS_PER_ROOM
isLeftWall = lastSlotIndex < PAINTINGS_PER_WALL
initialYaw = isLeftWall ? -PI/2 : PI/2
```

## PlayerController

Handles camera movement and rotation inside `useFrame` (defined in MuseumScene.tsx):
- **Desktop**: WASD/arrow keys for movement, mouse pointer-lock for look
- **Mobile**: Touch controls via callbacks from TouchControls component
- Yaw/pitch applied via `THREE.Euler(pitch, yaw, 0, 'YXZ')`
- Collision bounds clamp position within room walls
- Camera height locked to `CAMERA_HEIGHT`

## TouchControls (src/components/museum/TouchControls.tsx)

Mobile-only overlay (`'ontouchstart' in window` detection):
- Full-screen swipe-to-look
- Multi-touch tracking with unique touch IDs
- Communicates via `onMove(x, z)` and `onLook(dx, dy)` callbacks

## Data Types

```typescript
interface Drawing {
  id?: number;              // Auto-increment from IndexedDB
  name: string;             // User-provided name
  dataUrl: string;          // Canvas image as PNG data URL
  width: number;            // Viewport width when drawn
  height: number;           // Viewport height when drawn
  createdAt: number;        // Timestamp
}

interface WallSlot {
  position: [number, number, number];  // X, Y, Z in world space
  rotation: [number, number, number];  // Euler angles to face outward from wall
  wall: 'left' | 'right';
}
```

## Key Files

| File | Purpose |
|------|---------|
| `src/components/museum/MuseumScene.tsx` | Main 3D scene, Canvas, PlayerController |
| `src/components/museum/RoomManager.tsx` | Chunks drawings into rooms |
| `src/components/museum/MuseumRoom.tsx` | Single room geometry (floors, walls, doorways) |
| `src/components/museum/PictureFrame.tsx` | Artwork frame + texture + lighting |
| `src/components/museum/TouchControls.tsx` | Mobile touch overlay |
| `src/lib/museumLayout.ts` | Wall slot calculations, room positioning |
| `src/lib/constants.ts` | All room/game constants |
| `src/hooks/useDrawings.ts` | IndexedDB hook for loading/saving drawings |
| `src/hooks/useRoomState.ts` | Room unlock progression |

## Colors

- Floor: `#8B6914` (gold-brown)
- Walls: `#FFF8E7` (cream)
- Ceiling: `#F0E6D0` (pale cream)
- Gold frame: `#DAA520`
- Background: `#1a1a2e` (dark blue-black)
- Fog: `#FFF8E7` (warm, 10-60 units)
