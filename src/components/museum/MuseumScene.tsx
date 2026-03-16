'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ROOM_WIDTH, ROOM_DEPTH, ROOM_HEIGHT, CAMERA_HEIGHT, PAINTINGS_PER_ROOM, PAINTINGS_PER_WALL } from '@/lib/constants';
import { getRoomOffset } from '@/lib/museumLayout';
import RoomManager from './RoomManager';
import TouchControls from './TouchControls';
import type { Drawing } from '@/types';

interface MuseumSceneProps {
  drawings: Drawing[];
  playerName: string;
}

// --- Movement component (must be inside Canvas for useFrame) ---

interface PlayerControllerProps {
  moveInput: React.MutableRefObject<{ x: number; z: number }>;
  lookInput: React.MutableRefObject<{ dx: number; dy: number }>;
  totalRooms: number;
  initialPosition?: [number, number, number];
  initialYaw?: number;
}

function PlayerController({ moveInput, lookInput, totalRooms, initialPosition, initialYaw }: PlayerControllerProps) {
  const { camera } = useThree();
  const yaw = useRef(initialYaw ?? 0);
  const pitch = useRef(0);
  const initialized = useRef(false);

  // Set initial camera position on mount
  useEffect(() => {
    if (initialized.current || !initialPosition) return;
    initialized.current = true;
    camera.position.set(...initialPosition);
  }, [camera, initialPosition]);
  const keys = useRef(new Set<string>());

  // Keyboard input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Mouse pointer lock for desktop look
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const onClick = () => {
      if (!('ontouchstart' in window)) {
        canvas.requestPointerLock();
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        lookInput.current.dx += e.movementX * 0.002;
        lookInput.current.dy += e.movementY * 0.002;
      }
    };
    canvas.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [lookInput]);

  useFrame((_, delta) => {
    const speed = 4.0 * delta;

    // Apply look input (touch or mouse)
    yaw.current -= lookInput.current.dx;
    pitch.current -= lookInput.current.dy;
    pitch.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch.current));
    lookInput.current.dx = 0;
    lookInput.current.dy = 0;

    // Build direction vectors
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const right = new THREE.Vector3(1, 0, 0);
    right.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    // Keyboard movement (desktop)
    const kbDir = { x: 0, z: 0 };
    if (keys.current.has('w') || keys.current.has('arrowup')) kbDir.z += 1;
    if (keys.current.has('s') || keys.current.has('arrowdown')) kbDir.z -= 1;
    if (keys.current.has('a') || keys.current.has('arrowleft')) kbDir.x -= 1;
    if (keys.current.has('d') || keys.current.has('arrowright')) kbDir.x += 1;

    // Touch movement
    const touchDir = moveInput.current;

    // Combine inputs
    const moveX = kbDir.x + touchDir.x;
    const moveZ = kbDir.z - touchDir.z; // touch Y down = forward (positive Z in screen = negative Z in world)

    const movement = new THREE.Vector3();
    movement.addScaledVector(forward, moveZ * speed);
    movement.addScaledVector(right, moveX * speed);

    // Apply movement
    camera.position.add(movement);

    // AABB collision: keep player within museum bounds
    const halfW = ROOM_WIDTH / 2 - 0.5;
    const totalDepth = totalRooms * ROOM_DEPTH;
    const minZ = -ROOM_DEPTH / 2 + 0.5;
    const maxZ = totalDepth - ROOM_DEPTH / 2 - 0.5;

    camera.position.x = Math.max(-halfW, Math.min(halfW, camera.position.x));
    camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));
    camera.position.y = CAMERA_HEIGHT;

    // Apply rotation
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
  });

  return null;
}

// --- Main scene ---

export default function MuseumScene({ drawings, playerName }: MuseumSceneProps) {
  const moveInput = useRef({ x: 0, z: 0 });
  const lookInput = useRef({ dx: 0, dy: 0 });
  const totalRooms = Math.max(1, Math.ceil(drawings.length / PAINTINGS_PER_ROOM));

  // Compute initial camera position: center of the room with the last drawing, facing its wall
  const lastRoomIndex = Math.max(0, Math.ceil(drawings.length / PAINTINGS_PER_ROOM) - 1);
  const roomCenterZ = getRoomOffset(lastRoomIndex)[2]; // room center in Z
  const initialPosition: [number, number, number] = [0, CAMERA_HEIGHT, roomCenterZ];

  // Determine which wall the last painting is on
  const lastSlotIndex = drawings.length > 0 ? (drawings.length - 1) % PAINTINGS_PER_ROOM : 0;
  const isLeftWall = lastSlotIndex < PAINTINGS_PER_WALL;
  const initialYaw = isLeftWall ? -Math.PI / 2 : Math.PI / 2;

  const handleMove = useCallback((x: number, z: number) => {
    moveInput.current = { x, z };
  }, []);

  const handleLook = useCallback((dx: number, dy: number) => {
    lookInput.current.dx += dx;
    lookInput.current.dy += dy;
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{
          position: initialPosition,
          fov: 70,
          near: 0.1,
          far: 200,
        }}
        style={{ background: '#1a1a2e' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} color="#FFF8E7" />
        <directionalLight position={[5, ROOM_HEIGHT + 2, 5]} intensity={0.6} color="#FFFFFF" />

        {/* Fog for depth */}
        <fog attach="fog" args={['#FFF8E7', 10, 60]} />

        {/* Player controller */}
        <PlayerController
          moveInput={moveInput}
          lookInput={lookInput}
          totalRooms={totalRooms}
          initialPosition={initialPosition}
          initialYaw={initialYaw}
        />

        {/* Museum content */}
        <RoomManager drawings={drawings} playerName={playerName} />
      </Canvas>

      {/* Touch controls overlay (mobile only) */}
      <TouchControls onMove={handleMove} onLook={handleLook} />
    </div>
  );
}
