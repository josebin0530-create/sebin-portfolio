import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import './PeonyScene.css';

const layers = [
  { total: 10, radius: 0.22, size: 0.58, y: 0.18, openTilt: -0.28, color: '#ffd7e1' },
  { total: 14, radius: 0.42, size: 0.78, y: 0.1, openTilt: -0.58, color: '#ffc1d3' },
  { total: 18, radius: 0.66, size: 0.98, y: 0.02, openTilt: -0.9, color: '#ffa7c1' },
  { total: 22, radius: 0.92, size: 1.18, y: -0.08, openTilt: -1.18, color: '#ffbfd0' },
];

function Petal({ layer, index, total, radius, size, y, openTilt, color }) {
  const ref = useRef(null);
  const highlightRef = useRef(null);

  const angle = (Math.PI * 2 * index) / total + layer * 0.22;
  const delay = layer * 0.22 + index * 0.018;
  const twist = Math.sin(index * 1.7 + layer) * 0.28;
  const widthVariation = 0.86 + Math.sin(index * 2.3) * 0.08;
  const heightVariation = 1 + Math.cos(index * 1.9) * 0.08;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const progress = THREE.MathUtils.clamp((time - delay) / 2.4, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    if (!ref.current) return;

    const closedRadius = 0.08 + layer * 0.018;
    const currentRadius = THREE.MathUtils.lerp(closedRadius, radius, eased);
    const flutter = Math.sin(time * 0.65 + index * 0.7) * 0.025 * eased;

    ref.current.position.x = Math.cos(angle) * currentRadius;
    ref.current.position.z = Math.sin(angle) * currentRadius;
    ref.current.position.y = THREE.MathUtils.lerp(0.32 + layer * 0.04, y, eased);

    ref.current.rotation.y = -angle + twist * eased;
    ref.current.rotation.x = THREE.MathUtils.lerp(0.08, openTilt, eased) + flutter;
    ref.current.rotation.z = Math.sin(angle) * 0.22 + twist * 0.25 * eased;

    const petalScale = THREE.MathUtils.lerp(0.32, size, eased);
    ref.current.scale.set(
      petalScale * widthVariation,
      petalScale * 1.55 * heightVariation,
      petalScale * 0.18,
    );

    if (highlightRef.current) {
      highlightRef.current.material.opacity = THREE.MathUtils.lerp(0.06, 0.2, eased);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.22, 32, 20]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.68}
          transmission={0.08}
          thickness={0.25}
          clearcoat={0.18}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={highlightRef} position={[0.02, 0.05, 0.14]} scale={[0.58, 0.76, 0.4]}>
        <sphereGeometry args={[0.16, 24, 14]} />
        <meshBasicMaterial color="#fff7f3" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PeonyFlower() {
  const flowerRef = useRef(null);
  const centerRef = useRef(null);

  const petals = useMemo(
    () =>
      layers.flatMap((layer, layerIndex) =>
        Array.from({ length: layer.total }, (_, index) => ({
          ...layer,
          layer: layerIndex,
          index,
        })),
      ),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (flowerRef.current) {
      flowerRef.current.rotation.y = Math.sin(time * 0.22) * 0.14;
      flowerRef.current.rotation.z = Math.sin(time * 0.32) * 0.018;
    }

    if (centerRef.current) {
      const centerProgress = THREE.MathUtils.clamp((time - 1.1) / 1.7, 0, 1);
      const eased = 1 - Math.pow(1 - centerProgress, 3);
      centerRef.current.scale.setScalar(THREE.MathUtils.lerp(0.4, 1, eased));
      centerRef.current.position.y = THREE.MathUtils.lerp(0.2, 0.08, eased);
    }
  });

  return (
    <group ref={flowerRef} position={[0, -0.18, 0]} rotation={[0.32, 0, 0]} scale={1.06}>
      {petals.map((petal) => (
        <Petal
          key={`${petal.layer}-${petal.index}`}
          layer={petal.layer}
          index={petal.index}
          total={petal.total}
          radius={petal.radius}
          size={petal.size}
          y={petal.y}
          openTilt={petal.openTilt}
          color={petal.color}
        />
      ))}

      <group ref={centerRef}>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.19, 32, 20]} />
          <meshStandardMaterial color="#f06a98" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.12, 0]} scale={[0.78, 0.55, 0.78]}>
          <sphereGeometry args={[0.12, 24, 14]} />
          <meshStandardMaterial color="#a93d67" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export default function PeonyScene() {
  return (
    <div className="peony-scene" aria-label="Blooming peony flower">
      <Canvas
        camera={{ position: [0, 0.72, 3.45], fov: 35 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.28} />
        <directionalLight position={[2.2, 3.4, 4]} intensity={1.75} color="#fff2ea" />
        <pointLight position={[-2.4, 1.2, 2.2]} intensity={0.7} color="#ffd3df" />
        <PeonyFlower />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
