import React from 'react'
import { ObjectData } from '../../pages/DatasetSelectionPage'
import { Vector2, Vector3 } from 'three'
import { Ferrari } from './objects/Car/Ferrari'

interface EgoParams {
    objectData: ObjectData
    predictions?: Vector2[]
}

export function Ego(props: EgoParams) {
    return (
        <Ferrari
            color="#04e0e0"
            position={new Vector3(props.objectData.position.x, 0, props.objectData.position.y)}
            heading={props.objectData.velocity.angle() - Math.PI / 2}
            headlights
            predictions={[new Vector2(0, 0.5), new Vector2(1, 0.5), new Vector2(2, 0.5), new Vector2(3, 0.5)]}
        />
    )
}
