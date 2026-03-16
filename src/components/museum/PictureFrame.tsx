'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { Drawing } from '@/types';

interface PictureFrameProps {
  drawing: Drawing;
  position: [number, number, number];
  rotation: [number, number, number];
}

const FRAME_WIDTH = 2.5;
const FRAME_HEIGHT = 2;
const FRAME_DEPTH = 0.08;
const BORDER = 0.12;
const GOLD = '#DAA520';

export default function PictureFrame({ drawing, position, rotation }: PictureFrameProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  const texture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = drawing.dataUrl;
    const tex = new THREE.Texture(img);
    img.onload = () => {
      tex.needsUpdate = true;
    };
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [drawing.dataUrl]);

  const innerW = FRAME_WIDTH - BORDER * 2;
  const innerH = FRAME_HEIGHT - BORDER * 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Back plate */}
      <mesh position={[0, 0, -FRAME_DEPTH / 2]}>
        <boxGeometry args={[FRAME_WIDTH, FRAME_HEIGHT, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Frame border - top */}
      <mesh position={[0, FRAME_HEIGHT / 2 - BORDER / 2, 0]}>
        <boxGeometry args={[FRAME_WIDTH, BORDER, FRAME_DEPTH]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Frame border - bottom */}
      <mesh position={[0, -FRAME_HEIGHT / 2 + BORDER / 2, 0]}>
        <boxGeometry args={[FRAME_WIDTH, BORDER, FRAME_DEPTH]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Frame border - left */}
      <mesh position={[-FRAME_WIDTH / 2 + BORDER / 2, 0, 0]}>
        <boxGeometry args={[BORDER, FRAME_HEIGHT - BORDER * 2, FRAME_DEPTH]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Frame border - right */}
      <mesh position={[FRAME_WIDTH / 2 - BORDER / 2, 0, 0]}>
        <boxGeometry args={[BORDER, FRAME_HEIGHT - BORDER * 2, FRAME_DEPTH]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Drawing canvas */}
      {texture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[innerW, innerH]} />
          <meshStandardMaterial map={texture} side={THREE.FrontSide} />
        </mesh>
      )}

      {/* Spot light illuminating the painting */}
      <pointLight
        ref={lightRef}
        position={[0, 0.8, 0.6]}
        intensity={0.8}
        distance={4}
        color="#FFF5E0"
      />
    </group>
  );
}
