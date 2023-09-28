import { Color, ColorRepresentation, Group, Object3D, Vector2, Vector3 } from 'three'
import React, { useEffect, useMemo, useState } from 'react'
import { setMaterials } from './setCarMaterials'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { getCarSensors } from './getCarSensors'
import { volumetricSpotlightMaterial } from '../../helpers/VolumetricMaterial'
import { customArrow } from '../../helpers/customArrow'

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
    predictions?: Vector2[]
}

const predictionsToArrows = (predictions: Vector2[] | undefined, currentPos: Vector3, posYOffset: number, color: ColorRepresentation): Group[] => {
    if (!predictions) return []

    const start = new Vector2(currentPos.x, currentPos.z)
    const poses = [start, ...predictions]
    let arrows = []

    for (let i = 1; i < poses.length; i++) {
        const start = new Vector3(poses[i - 1].x, posYOffset, poses[i - 1].y)
        const end = new Vector3(poses[i].x, posYOffset, poses[i].y)
        const arrow = customArrow(start, end, 0.02, color)
        arrows.push(arrow)
    }
    return arrows
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

    /* eslint-disable react-hooks/exhaustive-deps */
    const predictionArrows = useMemo(() => predictionsToArrows(props.predictions, new Vector3(props.x, 0, props.y), 1.5, 'red'), [props.predictions])

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
        spotPosition: new Vector3(props.x, 0.6, props.y),
    })

    return (
        <>
            {model && (
                <>
                    <group position={[props.x, 0, props.y]} rotation={[0, props.heading, 0]}>
                        <group rotation={[0, Math.PI / 2, 0]}>
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
                                            <group key={position.join(',')} rotation={[-Math.PI / 2, 0, angle]} position={position}>
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
                    </group>
                    <group rotation={[0, 0, 0]}>
                        {predictionArrows.map((arrow) => (
                            <primitive key={`${arrow.position.x}${arrow.position.z}`} object={arrow} />
                        ))}
                    </group>
                </>
            )}
        </>
    )
}
