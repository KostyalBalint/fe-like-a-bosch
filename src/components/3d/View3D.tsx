import React, { createRef, ReactElement, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { CameraControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { UnknownObject } from './objects/UnknownObject'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib/controls/OrbitControls'
import { Path3D } from './Path3D'
import { ACESFilmicToneMapping, Vector2, Vector3 } from 'three'
import { OrthographicCamera as OrthographicCameraImpl } from 'three/src/cameras/OrthographicCamera'
import CameraControlsImpl from 'camera-controls'

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
}

export function View3D(props: View3DProps): ReactElement {
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
                <MyScene {...props} />
            </Canvas>
            <div className="absolute right-0 top-0 w-[30vw] aspect-video bg-gray-900">
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
                    <MyScene {...props} isTopDownView />
                </Canvas>
            </div>
        </div>
    )
}

const aspect = 16 / 9
const frustumSize = 10

const fakeCamera = new OrthographicCameraImpl()

const MyScene = (props: View3DProps & { isTopDownView?: boolean }) => {
    const orbitControlRef = createRef<CameraControlsImpl>()
    const fakeOrbitControlRef = createRef<CameraControlsImpl>()

    const cameraRef = createRef<OrthographicCameraImpl>()

    const followFromBack = true

    useEffect(() => {
        cameraRef.current?.lookAt(10, 0, 0)
        cameraRef?.current?.rotateOnWorldAxis(new Vector3(0, 1, 0), -1.23918377)
        cameraRef.current?.updateProjectionMatrix()
    }, [cameraRef])

    useFrame(() => {
        if (!orbitControlRef.current) return
        if (!fakeOrbitControlRef.current) return
        if (!followFromBack) return

        const azimuthAngle = props.ego.heading - Math.PI / 2 + fakeOrbitControlRef.current?.azimuthAngle

        orbitControlRef.current.rotateAzimuthTo(azimuthAngle, true)
    })

    return (
        <Suspense fallback={null}>
            <scene>
                <Lights />

                {props.objects.map((object) => {
                    return (
                        <group key={object.id}>
                            <UnknownObject x={object.position.x} y={object.position.y} color="white" />
                            <Path3D path={object.predictions.map((p) => p.position)} pathHeight={0} radius={0.1} />
                        </group>
                    )
                })}

                <Ego heading={props.ego.heading} speed={props.ego.speed} yawRate={props.ego.yawRate} isPlaying={props.isPlaying} />

                <BasePlane
                    velocity={
                        props.isPlaying ? new Vector2(props.ego.speed, 0).rotateAround(new Vector2(0, 0), -props.ego.heading) : new Vector2(0, 0)
                    }
                />

                {props.isTopDownView && (
                    <OrthographicCamera
                        ref={cameraRef}
                        makeDefault
                        position={[10, 10, 0]}
                        zoom={10}
                        near={0.1}
                        far={200}
                        left={(0.5 * frustumSize * aspect) / -2}
                        right={(0.5 * frustumSize * aspect) / 2}
                        top={frustumSize / 2}
                        bottom={frustumSize / -2}
                    />
                )}

                {!props.isTopDownView && (
                    <>
                        <PerspectiveCamera far={200} makeDefault position={[-20, 10, 0]} />
                        <Perf position="top-left" className="absolute" />
                    </>
                )}

                <CameraControls
                    enabled={!props.isTopDownView}
                    ref={orbitControlRef}
                    smoothTime={0.05}
                    maxPolarAngle={(80 / 180) * Math.PI}
                    minDistance={5}
                    maxDistance={60}
                />

                <CameraControls
                    enabled={props.isTopDownView}
                    camera={fakeCamera}
                    ref={fakeOrbitControlRef}
                    smoothTime={0.05}
                    maxPolarAngle={(80 / 180) * Math.PI}
                    minDistance={5}
                    maxDistance={60}
                />
            </scene>
        </Suspense>
    )
}
