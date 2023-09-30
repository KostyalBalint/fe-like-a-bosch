import React, { createRef, ReactElement, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { CameraControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { UnknownObject } from './objects/UnknownObject'
import { Path3D } from './Path3D'
import { ACESFilmicToneMapping, Vector2, Vector3 } from 'three'
import { OrthographicCamera as OrthographicCameraImpl } from 'three/src/cameras/OrthographicCamera'
import CameraControlsImpl from 'camera-controls'
import { IntersectedObject } from '../../simulation/collision-avoidance/CollisionDetector'
import { useSelectedObject } from '../../providers/selectedObjectProvider'
import { PerspectiveCamera as PerspectiveCameraImpl } from 'three/src/cameras/PerspectiveCamera'

interface View3DConfig {
    showPredictions: boolean
}

interface View3DProps {
    ego: {
        position: Vector2
        speed: number
        heading: number
        yawRate: number
        predictions: Prediction[]
    }
    collidingObject: IntersectedObject | null
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
                    toneMapping: ACESFilmicToneMapping,
                    pixelRatio: window.devicePixelRatio,
                }}
            >
                <MyScene {...props} />
            </Canvas>
            <div className="absolute bottom-0 left-0 w-[30vw] aspect-video bg-gray-900">
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

    const orthoCameraRef = createRef<OrthographicCameraImpl>()
    const perspectiveCameraRef = createRef<PerspectiveCameraImpl>()

    const { setSelectedObject, selectedObject } = useSelectedObject()

    const followFromBack = true

    useEffect(() => {
        orthoCameraRef.current?.lookAt(10, 0, 0)
        orthoCameraRef?.current?.rotateOnWorldAxis(new Vector3(0, 1, 0), -1.23918377)
        orthoCameraRef.current?.updateProjectionMatrix()
    }, [orthoCameraRef])

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
                    let color = 'white'
                    if (props.collidingObject?.object.id === object.id) color = 'red'
                    if (selectedObject === object.id) color = '#0054b6'

                    return (
                        <group key={object.id} onClick={() => setSelectedObject(object.id)}>
                            <UnknownObject x={object.position.x} y={object.position.y} color={color} />
                            <Path3D path={object.predictions.map((p) => p.position)} pathHeight={0.1} radius={0.2} />
                        </group>
                    )
                })}
                {props.collidingObject && (
                    <UnknownObject x={props.collidingObject.intersection.x} y={props.collidingObject.intersection.y} color="green" />
                )}
                <Ego
                    predictions={props.ego.predictions}
                    heading={props.ego.heading}
                    speed={props.ego.speed}
                    yawRate={props.ego.yawRate}
                    isPlaying={props.isPlaying}
                />
                <BasePlane carPosition={props.ego.position} />
                {props.isTopDownView && (
                    <OrthographicCamera
                        ref={orthoCameraRef}
                        makeDefault
                        position={[10, 10, 0]}
                        zoom={8}
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
                        <PerspectiveCamera ref={perspectiveCameraRef} far={200} makeDefault position={[-15, 10, 0]} />
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
