import { Car } from './objects/Car/Car'
import React from 'react'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { Vector2 } from 'three'

interface EgoParams {
    objectData: ObjectData
    displayHeading?: boolean
}

export function Ego(props: EgoParams) {
    return (
        <Car
            color="#04e0e0"
            x={props.objectData.position.x}
            y={props.objectData.position.y}
            heading={props.objectData.velocity.angleTo(new Vector2(1, 0))}
            displayHeading={props.displayHeading}
            headlights
        />
    )
}
