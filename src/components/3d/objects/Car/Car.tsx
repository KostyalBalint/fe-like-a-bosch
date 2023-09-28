import { Color, ConeGeometry, Euler, Object3D, Vector3 } from 'three'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { setMaterials } from './setCarMaterials'
import { useFrame, useThree } from '@react-three/fiber'
import { Cone, SpotLight, useDepthBuffer, useGLTF } from '@react-three/drei'
import { getCarSensors } from './getCarSensors'
import { isNumberObject } from 'util/types'
import { SpotLightNode } from 'three/examples/jsm/nodes/Nodes'
import { volumetricSpotlightMaterial } from '../../helpers/VolumetricMaterial'

interface CarProps {
    x: number
    y: number
    heading: number
    leftIndicator?: boolean
    rightIndicator?: boolean
    headlights?: boolean
    color?: string
    opacity?: number
    showSensors?: boolean
    displayHeading?: boolean
}

export const Car = ({ color = 'gray', opacity = 1, ...props }: CarProps) => {
    const [model, setModel] = useState<Object3D>()
    const [wheels, setWheels] = useState<Object3D[]>([])
    //const [fixRotation, setFixRotation] = useState(90);

    const rawModel = useGLTF('assets/ferrari.glb', true)

    const sensors = useMemo(() => getCarSensors(), [])

    const speed = 0.5

    useEffect(() => {
        const carModel = rawModel.scene.children[0]
        let triangles = 0
        carModel.traverseVisible(function (object) {
            // @ts-ignore
            if (object.isMesh) {
                // @ts-ignore
                const geometry = object.geometry

                if (geometry.index !== null) {
                    triangles += geometry.index.count / 3
                } else {
                    triangles += geometry.attributes.position.count / 3
                }
            }
        })

        console.log('Car has ' + triangles + ' triangles')

        if (!carModel) {
            console.error('No car model found')
            return
        }
        setMaterials(carModel, color, opacity)

        const wheelList = [
            carModel.getObjectByName('wheel_fl'),
            carModel.getObjectByName('wheel_fr'),
            carModel.getObjectByName('wheel_rl'),
            carModel.getObjectByName('wheel_rr'),
        ]
        setWheels(wheelList.filter((a) => a) as Object3D[])
        setModel(carModel)
        //setFixRotation(0);
    }, [rawModel, color, opacity])

    useFrame((state, delta, frame) => {
        wheels.forEach((wheel) => {
            wheel.rotation.x -= delta * speed * Math.PI * 2
        })
    })

    const spotLightPositions: {
        position: [number, number, number]
    }[] = [
        {
            position: [0.7, 0.6286, 3.1],
        },
        {
            position: [-0.7, 0.6286, 3.1],
        },
    ]

    const headLightMaterial = volumetricSpotlightMaterial({
        attenuation: 10,
        anglePower: 2,
        lightColor: new Color('#ffdeb8'),
        spotPosition: new Vector3(0, 0, 0),
    })

    return (
        <>
            {model && (
                <group position={[props.x, 0, props.y]} rotation={[0, props.heading + Math.PI / 2, 0]}>
                    <group rotation={[0, Math.PI, 0]} position={[0, 0, 1.33]} scale={[0.98, 0.98, 0.98]}>
                        <primitive object={model} />
                    </group>
                    {props.showSensors &&
                        sensors.map((sensor) => (
                            <>
                                <primitive object={sensor.camera} key={sensor.camera.uuid} />
                                <primitive object={sensor.helper} key={sensor.helper.uuid} />
                            </>
                        ))}
                    {props.headlights && (
                        <>
                            {spotLightPositions.map(({ position }, i) => {
                                const angle = i % 2 === 0 ? Math.PI / 16 : -Math.PI / 16
                                return (
                                    <group rotation={[-Math.PI / 2, 0, angle]} position={position}>
                                        <mesh position={[0, -2.5, 0]}>
                                            {/* @ts-ignore */}
                                            <coneGeometry args={[1.8, 5, 32]} openEnded />
                                            <primitive object={headLightMaterial} />
                                        </mesh>
                                    </group>
                                )
                            })}
                        </>
                    )}
                </group>
            )}
        </>
    )
}
/*
<SpotLight
                                        key={position.join(',')}
                                        ref={ref}
                                        distance={4}
                                        angle={0.3}
                                        attenuation={5}
                                        anglePower={0}
                                        position={position}
                                        target={target}
                                        color="yellow"
                                    />
 */
