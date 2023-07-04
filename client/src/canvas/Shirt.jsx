import React from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  const materialRef = React.useRef();

  useFrame((state, delta) => {
    if (materialRef.current && materialRef.current.color) {
      easing.dampC(materialRef.current.color, snap.color, 0.25, delta);
    }
  });

  const stateString = JSON.stringify(snap);

  // Create a custom material with anisotropy setting
  const customMaterial = React.useMemo(() => {
    const material = new MeshStandardMaterial();
    material.roughness = 1;
    material.map = logoTexture;
    material.map.anisotropy = 16; // Adjust the anisotropy value as needed
    return material;
  }, [logoTexture]);

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={customMaterial}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
