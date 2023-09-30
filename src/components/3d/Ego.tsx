import React from 'react'
import { Car } from './objects/Car/Car'
import { Prediction } from '../../pages/DatasetSelectionPage'
import { Vector2 } from 'three'

interface EgoParams {
    heading: number
    yawRate?: number
    speed?: number
    predictions?: Prediction[]
    isPlaying: boolean
}

export function Ego(props: EgoParams) {
    return (
        <Car
            color="#04e0e0"
            x={0}
            y={0}
            heading={props.heading + Math.PI / 2}
            predictions={props.predictions?.map((p) => p.position)}
            speed={props.speed}
            yawRate={props.yawRate}
            isPlaying={props.isPlaying}
        />
    )
}
