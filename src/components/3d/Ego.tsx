import React from 'react'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { Vector2, Vector3 } from 'three'
import { Ferrari } from './objects/Car/Ferrari'

interface EgoParams {
    heading: number
    predictions?: Vector2[]
    isPlaying: boolean
}

export function Ego(props: EgoParams) {
    return (
        <Ferrari
            color="#04e0e0"
            position={new Vector3(0, 0, 0)}
            heading={props.heading + Math.PI / 2}
            isPlaying={props.isPlaying}
            headlights
            predictions={props.predictions}
        />
    )
}
