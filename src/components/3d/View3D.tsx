import React, { ReactElement } from 'react'
import { Canvas } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { Controls } from './Controls'
import { ACESFilmicToneMapping, Scene, Vector3 } from 'three'
import { Environment, Sky, useKeyboardControls } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { Pedestrian, PedestrianMovementState } from './objects/Pedestrian'
import { KeyboardsControls } from '../../pages/SimulationPage'

interface View3DConfig {
    showPredictions: boolean
}

interface View3DProps {
    ego: ObjectData
    objects: ObjectData[]
    config: View3DConfig
}

export function View3D(props: View3DProps): ReactElement {
    const sceneRef = React.useRef<Scene>(new Scene())

    const forwardPressed = useKeyboardControls<KeyboardsControls>((state) => state.forward)
    const backwardPressed = useKeyboardControls<KeyboardsControls>((state) => state.back)

    return (
        <Canvas
            style={{ height: '100%', width: '100%' }}
            gl={{
                antialias: true,
                outputColorSpace: 'srgb',
                toneMapping: ACESFilmicToneMapping,
                toneMappingExposure: 0.8,
                pixelRatio: window.devicePixelRatio,
            }}
        >
            <scene ref={sceneRef}>
                <Perf position="top-left" />
                <Sky sunPosition={[7, 5, 1]} />

                <Environment files="assets/venice_sunset_1k.hdr" path="/" />

                <Lights />

                <Pedestrian
                    x={0}
                    y={0}
                    heading={0}
                    movementState={
                        forwardPressed
                            ? PedestrianMovementState.Running
                            : backwardPressed
                            ? PedestrianMovementState.Idle
                            : PedestrianMovementState.Walking
                    }
                />

                <Ego objectData={props.ego} />

                <BasePlane />
                <Controls cameraLookAt={new Vector3(props.ego.position.x, 0, props.ego.position.y)} />
            </scene>
        </Canvas>
    )
}
