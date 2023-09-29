import React, { createRef, ReactElement, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { ACESFilmicToneMapping, Object3D, Scene, Vector2, Vector3 } from 'three'
import { Environment, OrbitControls, PerspectiveCamera, Sky, useKeyboardControls } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { Pedestrian, PedestrianMovementState } from './objects/Pedestrian'
import { KeyboardsControls } from '../../pages/SimulationPage'
import { PredictionsViewer } from './objects/PredictionsViewer'
import { PerspectiveCamera as PerspectiveCameraImpl } from 'three/src/cameras/PerspectiveCamera'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib/controls/OrbitControls'

interface View3DConfig {
    showPredictions: boolean
}

interface View3DProps {
    ego: ObjectData
    objects: ObjectData[]
    config: View3DConfig
}

export function View3D(props: View3DProps): ReactElement {
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
            <MyScene {...props} />
        </Canvas>
    )
}

const MyScene = (props: View3DProps) => {
    const sceneRef = React.useRef<Scene>(new Scene())

    const forwardPressed = useKeyboardControls<KeyboardsControls>((state) => state.forward)
    const backwardPressed = useKeyboardControls<KeyboardsControls>((state) => state.back)

    const egoRef = useRef<Object3D>()
    const cameraRef = createRef<PerspectiveCameraImpl>()
    const orbitControlRef = createRef<OrbitControlsImpl>()

    //<PerspectiveCamera ref={cameraRef} far={100} position={new Vector3(0, 2, 0)} lookAt={() => egoRef.current?.position} makeDefault />
    const camera = useMemo(() => <PerspectiveCamera ref={cameraRef} far={100} position={new Vector3(0, 2, 0)} makeDefault />, [cameraRef])
    //const fakeCamera = useMemo(() => cameraRef?.current?.clone(), [cameraRef.current])
    const [fakeCamera, setFakeCamera] = useState<PerspectiveCameraImpl>()

    useEffect(() => {
        setFakeCamera((prev) => prev ?? cameraRef.current?.clone())
    }, [cameraRef])

    const controls = useMemo(
        () => (
            <OrbitControls
                ref={orbitControlRef}
                camera={fakeCamera}
                enableDamping
                dampingFactor={0.1}
                maxPolarAngle={(80 / 180) * Math.PI}
                minDistance={5}
                maxDistance={40}
            />
        ),
        [orbitControlRef, fakeCamera]
    )

    useFrame(() => {
        if (egoRef.current?.position) {
            //cameraRef.current?.lookAt(egoRef.current?.position)
            //cameraRef.current?.updateProjectionMatrix()

            //const polarAngle = orbitControlRef.current?.getPolarAngle()
            //const azimuthalAngle = orbitControlRef.current?.getAzimuthalAngle()

            orbitControlRef.current?.target.set(egoRef.current?.position.x, egoRef.current?.position.y, egoRef.current?.position.z)

            orbitControlRef.current?.update()
        }
        if (fakeCamera) {
            cameraRef.current?.copy(fakeCamera)
        }
    })

    return (
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

                <Ego objectData={props.ego} carRef={egoRef} />

                <BasePlane />

                {camera}
                {controls}
            </scene>
        </Suspense>
    )
}
