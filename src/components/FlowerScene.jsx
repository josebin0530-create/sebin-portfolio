import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './FlowerScene.css';

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const lerp = (from, to, t) => from + (to - from) * t;
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

function createPetalShape(width = 0.42, height = 1.08, curl = 0.08) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-width * 0.34, height * 0.1, -width * 0.56, height * 0.38, -width * 0.42, height * 0.66);
  shape.bezierCurveTo(-width * 0.32, height * 0.86, -width * 0.12, height * 1.02, 0, height);
  shape.bezierCurveTo(width * 0.12, height * 0.96, width * 0.31, height * 0.84, width * 0.42, height * 0.64);
  shape.bezierCurveTo(width * 0.58, height * 0.36, width * 0.32, height * 0.1, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape, 28);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const edge = Math.abs(x) / width;
    const wave = Math.sin(y * 18) * curl * edge;
    const cup = -Math.pow(edge, 1.7) * 0.12 + Math.sin(y * 3.2) * 0.035;

    positions.setX(i, x + wave);
    positions.setZ(i, cup);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function Petal({ petal, progress, geometry }) {
  const groupRef = useRef(null);
  const materialRef = useRef(null);

  useFrame(({ clock }) => {
    const open = easeOutQuart(clamp01((progress - petal.delay) / petal.duration));
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) return;

    const breeze = Math.sin(clock.elapsedTime * petal.breezeSpeed + petal.angle * 2.1) * petal.breeze;
    const budLift = lerp(0.08, petal.y, open);

    group.position.set(
      Math.cos(petal.angle) * lerp(0.08, petal.radius, open),
      budLift,
      Math.sin(petal.angle) * lerp(0.08, petal.radius, open),
    );

    group.rotation.set(
      lerp(petal.closedX, petal.openX, open) + breeze,
      petal.tiltY + Math.sin(clock.elapsedTime * 0.36 + petal.delay) * 0.018,
      petal.angle + lerp(petal.closedTwist, petal.openTwist, open),
    );

    group.scale.set(
      lerp(0.58, petal.scaleX, open),
      lerp(0.7, petal.scaleY, open),
      1,
    );

    material.opacity = lerp(0.58, petal.opacity, open);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color={petal.color}
          roughness={0.82}
          transmission={0.08}
          thickness={0.12}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geometry} position={[0, 0.018, -0.006]} scale={[0.72, 0.92, 1]}>
        <meshBasicMaterial
          color="#fff8f2"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Peony({ progress }) {
  const flowerRef = useRef(null);
  const coreRef = useRef(null);
  const petalGeometry = useMemo(() => createPetalShape(), []);

  const petals = useMemo(() => {
    const rings = [
      { count: 11, radius: 0.34, y: -0.08, delay: 0.04, scaleX: 1.34, scaleY: 1.12, openX: -0.98, color: '#f5b3c4' },
      { count: 10, radius: 0.24, y: 0.02, delay: 0.18, scaleX: 1.08, scaleY: 0.98, openX: -0.68, color: '#f9c8d2' },
      { count: 8, radius: 0.14, y: 0.12, delay: 0.34, scaleX: 0.82, scaleY: 0.82, openX: -0.36, color: '#ffd6dc' },
      { count: 6, radius: 0.06, y: 0.24, delay: 0.48, scaleX: 0.56, scaleY: 0.62, openX: -0.16, color: '#f39caf' },
    ];

    return rings.flatMap((ring, ringIndex) =>
      Array.from({ length: ring.count }, (_, i) => {
        const ratio = i / ring.count;
        const angle = ratio * Math.PI * 2 + ringIndex * 0.27;
        const wobble = Math.sin(i * 12.989 + ringIndex * 4.1) * 0.055;

        return {
          angle,
          radius: ring.radius + wobble,
          y: ring.y + Math.cos(i * 1.8) * 0.025,
          delay: ring.delay + i * 0.018,
          duration: 0.48 + ringIndex * 0.04,
          scaleX: ring.scaleX + Math.sin(i * 2.4) * 0.08,
          scaleY: ring.scaleY + Math.cos(i * 2.1) * 0.07,
          color: ring.color,
          opacity: ringIndex === 0 ? 0.76 : 0.84,
          closedX: 1.28 - ringIndex * 0.1,
          openX: ring.openX,
          tiltY: Math.sin(angle) * 0.2,
          closedTwist: Math.cos(i) * 0.08,
          openTwist: Math.sin(i * 1.7) * 0.22,
          breeze: 0.012 + ringIndex * 0.004,
          breezeSpeed: 0.55 + ringIndex * 0.18,
        };
      }),
    );
  }, []);

  useFrame(({ clock }) => {
    if (flowerRef.current) {
      flowerRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.12;
      flowerRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.42) * 0.018;
    }

    if (coreRef.current) {
      const coreOpen = easeOutQuart(clamp01((progress - 0.46) / 0.34));
      coreRef.current.scale.setScalar(lerp(0.2, 1, coreOpen));
      coreRef.current.position.y = lerp(0.16, 0.26, coreOpen);
    }
  });

  return (
    <group ref={flowerRef} position={[0, -0.44, 0]} rotation={[0.08, 0, 0]} scale={1.08}>
      <mesh position={[0, -1.06, 0]} rotation={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.026, 0.052, 1.7, 18]} />
        <meshStandardMaterial color="#5f7f43" roughness={0.78} />
      </mesh>

      <mesh position={[-0.22, -0.72, 0.02]} rotation={[0.78, 0.22, 0.92]} scale={[0.32, 0.1, 0.018]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color="#779c59" roughness={0.8} />
      </mesh>

      <mesh position={[0.22, -0.54, -0.02]} rotation={[0.74, -0.16, -0.86]} scale={[0.28, 0.09, 0.018]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color="#86a965" roughness={0.8} />
      </mesh>

      <group position={[0, 0.1, 0]}>
        {petals.map((petal) => (
          <Petal key={`${petal.angle}-${petal.delay}`} petal={petal} progress={progress} geometry={petalGeometry} />
        ))}

        <group ref={coreRef}>
          <mesh>
            <sphereGeometry args={[0.14, 28, 18]} />
            <meshStandardMaterial color="#d0798d" roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.03, 0]} scale={[0.8, 0.45, 0.8]}>
            <sphereGeometry args={[0.1, 20, 12]} />
            <meshStandardMaterial color="#9d3f5e" roughness={0.82} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function FlowerScene({ scrollProgress = 0 }) {
  const progress = clamp01(scrollProgress * 1.12);

  return (
    <div className="flower-scene" aria-label="Blooming peony flower">
      <Canvas
        camera={{ position: [0, 0.2, 4.7], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[2.2, 3.6, 3.8]} intensity={1.25} color="#fff4ea" />
        <directionalLight position={[-2.8, 1.4, 2.2]} intensity={0.54} color="#f7c0ca" />
        <Peony progress={progress} />
      </Canvas>
    </div>
  );
}
