import { OrthographicCamera as OrthographicCameraImpl, PerspectiveCamera as PerspectiveCameraImpl, Vector3 } from 'three'
import React, { createRef, Suspense, useEffect } from 'react'
import CameraControlsImpl from 'camera-controls'
import { useSelectedObject } from '../../context/SelectedObjectContext'
import { useFrame } from '@react-three/fiber'
import { Lights } from './Lights'
import { UnknownObject } from './objects/UnknownObject'
import { Path3D } from './Path3D'
import { Ego } from './Ego'
import { Signal } from '../../pages/dataset-selection/types'
import { BasePlane } from './BasePlane'
import { CameraControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { View3DProps } from './View3D'

const aspect = 16 / 9
const frustumSize = 10
const fakeCamera = new OrthographicCameraImpl()
export const SimulationScene = (props: View3DProps & { isTopDownView?: boolean }) => {
    const orbitControlRef = createRef<CameraControlsImpl>()
    const fakeOrbitControlRef = createRef<CameraControlsImpl>()

    const orthoCameraRef = createRef<OrthographicCameraImpl>()
    const perspectiveCameraRef = createRef<PerspectiveCameraImpl>()

    const { setSelectedObject, selectedObject } = useSelectedObject()

    const followFromBack = true

    // Set the position of the orthographic camera
    useEffect(() => {
        orthoCameraRef.current?.lookAt(10, 0, 0)
        orthoCameraRef?.current?.rotateOnWorldAxis(new Vector3(0, 1, 0), -1.23918377)
        orthoCameraRef.current?.updateProjectionMatrix()
    }, [orthoCameraRef])

    // Set the position of the perspective camera
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
                            {props.config.showPredictions && (
                                <Path3D path={object.predictions.map((p) => p.position)} pathHeight={0.1} radius={0.2} />
                            )}
                        </group>
                    )
                })}
                {props.collidingObject && props.config.showIntersections && (
                    <UnknownObject x={props.collidingObject.intersection.x} y={props.collidingObject.intersection.y} color="green" />
                )}
                <Ego
                    predictions={props.ego.predictions}
                    heading={props.ego.heading}
                    speed={props.ego.speed}
                    yawRate={props.ego.yawRate}
                    isPlaying={props.isPlaying}
                    brakeDistance={props.avoidanceData.brakeDistance}
                    config={props.config}
                    headlights={props.avoidanceData.signal === Signal.HEADLIGHT_FLASH}
                />
                {!props.isTopDownView && <BasePlane carPosition={props.ego.position} />}
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
