import { Plane } from "@react-three/drei";
import React from "react";
import { DoubleSide } from "three";

export function BasePlane() {
  return (
    <>
      <gridHelper args={[5000, 5000]} position={[0, 0.05, 0]}>
        <meshBasicMaterial color="gray" side={DoubleSide} />
      </gridHelper>
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        args={[100000, 100000]}
      >
        <meshStandardMaterial attach="material" color="white" />
      </Plane>
    </>
  );
}
