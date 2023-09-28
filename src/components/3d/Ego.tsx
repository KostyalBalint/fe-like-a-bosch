import { Car } from './objects/Car/Car'
import React from 'react'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { Vector2 } from 'three'

interface EgoParams {
    objectData: ObjectData
    predictions?: Vector2[]
}

export function Ego(props: EgoParams) {
    return (
        <Car
            color="#04e0e0"
            x={props.objectData.position.x}
            y={props.objectData.position.y}
            heading={props.objectData.velocity.angle() - Math.PI / 2}
            headlights
            predictions={[new Vector2(0, 0.5), new Vector2(1, 0.5), new Vector2(2, 0.5), new Vector2(3, 0.5)]}
        />
    )
}
