import React, { createRef, ReactElement, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { UnknownObject } from './objects/UnknownObject'
import { PerspectiveCamera as PerspectiveCameraImpl } from 'three/src/cameras/PerspectiveCamera'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib/controls/OrbitControls'
import { Path3D } from './Path3D'
import { Paper } from '@mui/material'
import { ACESFilmicToneMapping, OrthographicCamera, Scene, Vector2 } from 'three'

interface View3DConfig {
    showPredictions: boolean
}

interface View3DProps {
    ego: {
        speed: number
        heading: number
        yawRate: number
        predictions: Prediction[]
    }
    objects: ObjectDataWithPrediction[]
    config: View3DConfig
    isPlaying: boolean
    sceneRef?: any
}

export function View3D(props: View3DProps): ReactElement {
    const sceneRef = React.createRef<Scene>()
    return (
        <div className="h-full relative">
            <Canvas
                style={{ height: '100%', width: '100%', position: 'relative' }}
                gl={{
                    antialias: true,
                    outputColorSpace: 'srgb',
                    toneMapping: ACESFilmicToneMapping,
                    toneMappingExposure: 0.8,
                    pixelRatio: window.devicePixelRatio,
                }}
            >
                <MyScene {...props} sceneRef={sceneRef} />
            </Canvas>
            <div className="absolute right-0 top-0 w-[20vw] aspect-video">
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
                    <TopDownView originalScene={sceneRef.current} />
                </Canvas>
            </div>
        </div>
    )
}

const TopDownView = (props: { originalScene: Scene | null }) => {
    const camera2 = new OrthographicCamera(60, 2, 0.1)
    camera2.position.set(40, 10, 30)
    camera2.lookAt(0, 5, 0)

    useThree(({ gl }) => {
        if (!props.originalScene) return
        gl.render(props.originalScene, camera2)
    })

    return <></>
}

const MyScene = (props: View3DProps) => {
    const cameraRef = createRef<PerspectiveCameraImpl>()
    const orbitControlRef = createRef<OrbitControlsImpl>()

    return (
        <Suspense fallback={null}>
            <scene ref={props.sceneRef}>
                <Perf position="top-left" className="absolute" />

                <Lights />

                {props.objects.map((object) => {
                    return (
                        <group key={object.id}>
                            <UnknownObject x={object.position.x} y={object.position.y} />
                            <Path3D path={object.predictions.map((p) => p.position)} pathHeight={0.5} radius={0.1} />
                        </group>
                    )
                })}

                <Ego heading={props.ego.heading} speed={props.ego.speed} yawRate={props.ego.yawRate} isPlaying={props.isPlaying} />

                <BasePlane
                    velocity={
                        props.isPlaying ? new Vector2(props.ego.speed, 0).rotateAround(new Vector2(0, 0), -props.ego.heading) : new Vector2(0, 0)
                    }
                />

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
