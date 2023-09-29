import React, { createRef, ReactElement, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { ACESFilmicToneMapping, Scene, Vector2 } from 'three'
import { Environment, OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { UnknownObject } from './objects/UnknownObject'
import { PerspectiveCamera as PerspectiveCameraImpl } from 'three/src/cameras/PerspectiveCamera'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib/controls/OrbitControls'
import { Path3D } from './Path3D'

interface View3DConfig {
    showPredictions: boolean
}

interface View3DProps {
    ego: {
        speed: number
        heading: number
    }
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

const num_points = 100
const radius = 3

const path: Vector2[] = Array.from({ length: 100 }).map((_, i) => {
    const theta = (i * (2 * Math.PI)) / num_points
    const x = radius * Math.cos(theta)
    const y = radius * Math.sin(theta)
    return new Vector2(x, y)
})

const MyScene = (props: View3DProps) => {
    const sceneRef = React.createRef<Scene>()

    const cameraRef = createRef<PerspectiveCameraImpl>()
    const orbitControlRef = createRef<OrbitControlsImpl>()

    return (
        <Suspense fallback={null}>
            <scene ref={sceneRef}>
                <Perf position="top-left" />
                <Sky sunPosition={[7, 5, 1]} />

                <Environment files="assets/venice_sunset_1k.hdr" path="/" />

                <Lights />

                {props.objects.map((object) => {
                    return <UnknownObject key={object.id} x={object.position.x} y={object.position.y} />
                })}

                <Ego heading={props.ego.heading} />

                <BasePlane velocity={new Vector2(props.ego.speed, 0).rotateAround(new Vector2(0, 0), -props.ego.heading)} />

                <Path3D path={path} pathHeight={0.5} radius={0.1} closed />

                <PerspectiveCamera ref={cameraRef} far={100} makeDefault />
                <OrbitControls
                    ref={orbitControlRef}
                    enableDamping
                    dampingFactor={0.1}
                    maxPolarAngle={(80 / 180) * Math.PI}
                    minDistance={5}
                    maxDistance={40}
                />
            </scene>
        </Suspense>
    )
}
