import React, { ReactElement, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { ACESFilmicToneMapping, Scene, Vector2, Vector3 } from 'three'
import { Environment, OrbitControls, PerspectiveCamera, Sky, useKeyboardControls } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { Pedestrian, PedestrianMovementState } from './objects/Pedestrian'
import { KeyboardsControls } from '../../pages/SimulationPage'
import { PredictionsViewer } from './objects/PredictionsViewer'

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

    const camera = useMemo(() => <PerspectiveCamera far={100} position={new Vector3(0, 2, 0)} makeDefault />, [])

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
            <Suspense fallback={null}>
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

                    <PredictionsViewer predictions={[new Vector2(0, 0.5), new Vector2(1, 0.5), new Vector2(2, 1), new Vector2(3, 0.5)]} />

                    <Ego objectData={props.ego} />

                    <BasePlane />

                    {camera}
                    <OrbitControls enableDamping dampingFactor={0.1} maxPolarAngle={(80 / 180) * Math.PI} minDistance={5} maxDistance={40} />
                </scene>
            </Suspense>
        </Canvas>
    )
}
