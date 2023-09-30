import React from 'react'
import { Car } from './objects/Car/Car'
import { Vector2 } from 'three'
import { Prediction } from '../../pages/dataset-selection/types'
import { View3DConfig } from './View3D'

interface EgoParams {
    heading: number
    yawRate?: number
    speed?: number
    predictions?: Prediction[]
    isPlaying: boolean
    headlights?: boolean
    brakeDistance?: number
    config: View3DConfig
}

export function Ego(props: EgoParams) {
    return (
        <Car
            color="#04e0e0"
            x={0}
            y={0}
            heading={props.heading + Math.PI / 2}
            config={props.config}
            predictions={props.predictions?.map((p) => p.position)}
            brakeDistance={props.brakeDistance}
            speed={props.speed}
            yawRate={props.yawRate}
            isPlaying={props.isPlaying}
            headlights={props.headlights}
        />
    )
}
