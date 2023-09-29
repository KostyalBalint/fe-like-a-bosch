import React from 'react'
import { Car } from './objects/Car/Car'
import { Prediction } from '../../pages/DatasetSelectionPage'

interface EgoParams {
    heading: number
    yawRate?: number
    speed?: number
    predictions?: Prediction[]
    isPlaying: boolean
}

export function Ego(props: EgoParams) {
    return (
        /*<Ferrari
            color="#04e0e0"
            position={new Vector3(0, 0, 0)}
            heading={props.heading + Math.PI / 2}
            isPlaying={props.isPlaying}
            headlights
            predictions={props.predictions}
        />*/
        <Car
            color="#04e0e0"
            x={0}
            y={0}
            heading={props.heading + Math.PI / 2}
            headlights
            predictions={props.predictions?.map((p) => p.position)}
            speed={props.speed}
            yawRate={props.yawRate}
            isPlaying={props.isPlaying}
        />
    )
}
