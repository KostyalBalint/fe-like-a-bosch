import { Color, Vector2, Vector3 } from 'three'
import React from 'react'
import { volumetricSpotlightMaterial } from '../../helpers/VolumetricMaterial'
import { Tesla } from '../Tesla'
import { Path3D } from '../../Path3D'
import { animated, useSpring } from '@react-spring/three'
import { View3DConfig } from '../../View3D'

interface CarProps {
    x: number
    y: number
    yawRate?: number
    speed?: number
    heading: number
    leftIndicator?: boolean
    rightIndicator?: boolean
    headlights?: boolean
    color?: string
    opacity?: number
    showSensors?: boolean
    predictions?: Vector2[]
    isPlaying: boolean
    brakeDistance?: number
    config: View3DConfig
}

export const Car = ({ color = 'gray', opacity = 1, isPlaying, predictions, brakeDistance, ...props }: CarProps) => {
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

    const { position, rotation } = useSpring({
        position: [props.x, 0, props.y],
        rotation: [0, props.heading - Math.PI / 2, 0],
    })

    return (
        <>
            {props.config.showPredictions && (
                <group scale={[1, 1, -1]}>
                    <Path3D path={predictions ?? []} pathHeight={0.1} radius={0.6} />
                </group>
            )}
            {/* @ts-ignore */}
            <animated.mesh position={position} rotation={rotation}>
                <group>
                    <group scale={[1, 1, -1]} position={[0, 0, 0]}>
                        {brakeDistance && predictions && props.config.showBrakeDistance && (
                            <Path3D
                                color={new Color('#eba9fd')}
                                toOpacity={0.7}
                                path={[new Vector2(0, 0), new Vector2(3.8, 0), new Vector2(3.8 + brakeDistance, 0)]}
                                pathHeight={0.3}
                                radius={0.3}
                            />
                        )}
                    </group>

                    <group rotation={[0, Math.PI / 2, 0]}>
                        <group rotation={[0, 0, 0]} position={[0, 0.1, 1.7]} scale={[0.6, 0.6, 0.6]}>
                            <Tesla yawRate={props.yawRate} speed={props.speed} isPlaying={isPlaying} />
                        </group>
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
            </animated.mesh>
        </>
    )
}
