import React, { createRef, ReactElement, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { BasePlane } from './BasePlane'
import { Lights } from './Lights'
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { Ego } from './Ego'
import { Perf } from 'r3f-perf'
import { ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { UnknownObject } from './objects/UnknownObject'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib/controls/OrbitControls'
import { Path3D } from './Path3D'
import { ACESFilmicToneMapping, Vector2, Vector3 } from 'three'
import { OrthographicCamera as OrthographicCameraImpl } from 'three/src/cameras/OrthographicCamera'

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

const MyScene = (props: View3DProps & { isTopDownView?: boolean }) => {
    const orbitControlRef = createRef<OrbitControlsImpl>()
    const cameraRef = createRef<OrthographicCameraImpl>()

    useEffect(() => {
        cameraRef.current?.lookAt(10, 0, 0)
        cameraRef?.current?.rotateOnWorldAxis(new Vector3(0, 1, 0), -1.23918377)
        cameraRef.current?.updateProjectionMatrix()
    }, [cameraRef])

    //const sceneRef = React.useRef<Scene>()
    //const cameraRef = React.useRef<PerspectiveCameraImpl>()

    return (
        <Suspense fallback={null}>
            <scene>
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

                {props.isTopDownView && (
                    <OrthographicCamera
                        ref={cameraRef}
                        makeDefault
                        position={[10, 10, 0]}
                        zoom={10}
                        near={0.1}
                        far={100}
                        left={(0.5 * frustumSize * aspect) / -2}
                        right={(0.5 * frustumSize * aspect) / 2}
                        top={frustumSize / 2}
                        bottom={frustumSize / -2}
                    />
                )}

                {!props.isTopDownView && (
                    <>
                        <PerspectiveCamera far={100} makeDefault />
                        <Perf position="top-left" className="absolute" />
                    </>
                )}

                <OrbitControls
                    enabled={!props.isTopDownView}
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
