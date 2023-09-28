import React, { ReactElement } from "react";
import { Canvas } from "@react-three/fiber";
import { BasePlane } from "./BasePlane";
import { Lights } from "./Lights";
import { Controls } from "./Controls";
import { ACESFilmicToneMapping, sRGBEncoding } from "three";
import { Environment, Sky, useAnimations } from "@react-three/drei";
import { Ego } from "./Ego";
import { Perf } from "r3f-perf";
import { ObjectData } from "../../pages/DatasetSelectionPage";

interface View3DConfig {
  showPredictions: boolean;
}

interface View3DProps {
  ego: ObjectData;
  objects: ObjectData[];
  config: View3DConfig;
}

export function View3D(props: View3DProps): ReactElement {
  return (
    <Canvas
      style={{ height: "100%", width: "100%" }}
      gl={{
        antialias: true,
        outputEncoding: sRGBEncoding,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
        pixelRatio: window.devicePixelRatio,
      }}
    >
      <scene>
        <Perf />
        <Sky sunPosition={[7, 5, 1]} />

        <Environment files="assets/venice_sunset_1k.hdr" path="/" />

        <Lights />

        <Ego showSensors={false} showBlindSpots={false} />

        <BasePlane />
        <Controls />
      </scene>
    </Canvas>
  );
}
