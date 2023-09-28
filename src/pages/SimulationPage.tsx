import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Vector3 } from "three";
import { View3D } from "../components/3d/View3D";
import { ObjectDataWithPrediction } from "./DatasetSelectionPage";
import { PlaybackControl } from "../components/PlaybackControl";

enum ScenarioType {
  CPNCO = "CPNCO",
  CPTA = "CPTA",
  CPLA = "CPLA",
}

enum Signal {
  HORN = "HORN",
  HEADLIGHT_FLASH = "HEADLIGHT_FLASH",
}

interface AvoidanceData {
  signal: Signal;
  brakeDistance: number;
  decelerationNeeded: number;
}

interface SimulationResult {
  ego: ObjectDataWithPrediction;
  objects: ObjectDataWithPrediction[];
  scenarioType: ScenarioType;
  avoidanceData: AvoidanceData;
  timestamp: number;
}

type SimulationPageProps = {
  values: SimulationResult[];
};

export const SimulationPage = (props: SimulationPageProps) => {
  const [currentSimulationStep, setCurrentSimulationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSimulationStep((step) => step + 1);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const currentSimulationResult = props.values[currentSimulationStep];

  return (
    <Stack height="100vh">
      <View3D
        config={{
          showPredictions: true,
        }}
        ego={{
          position: new Vector3(0, 0, 0),
          velocity: new Vector3(0, 0, 0),
          id: 0,
        }}
        objects={[]}
      />
      <PlaybackControl
        value={currentSimulationStep}
        onTogglePlayback={() => {}}
        speed={1}
        onSpeedChange={() => {}}
        isPlaying
        total={props.values.length}
      />
    </Stack>
  );
};
