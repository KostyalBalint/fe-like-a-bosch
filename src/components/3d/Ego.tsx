import React from 'react'
import { Vector2 } from 'three'
import { Car } from './objects/Car/Car'
import { ObjectData, Prediction } from '../../pages/DatasetSelectionPage'
import { Vector2, Vector3 } from 'three'
import { Ferrari } from './objects/Car/Ferrari'

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
