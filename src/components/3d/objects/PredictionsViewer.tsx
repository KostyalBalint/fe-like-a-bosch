import React, { useEffect, useMemo, useRef } from 'react'
import { ColorRepresentation, Object3D, Vector2, Vector3 } from 'three'
import { customArrow } from '../helpers/customArrow'

const predictionsToArrows = (
    predictions: Vector2[] | undefined,
    posYOffset: number,
    color: ColorRepresentation
): { start: Vector3; end: Vector3 }[] => {
    if (!predictions) return []

    let arrows = []

    for (let i = 1; i < predictions.length; i++) {
        //const arrow = customArrow(start, end, 0.02, color)
        arrows.push({
            start: new Vector3(predictions[i - 1].x, posYOffset, predictions[i - 1].y),
            end: new Vector3(predictions[i].x, posYOffset, predictions[i].y),
        })
    }
    return arrows
}

interface PredictionViewerProps {
    tempStart?: Object3D
    tempEnd?: Object3D
    predictions: Vector2[]
}

export const PredictionsViewer = ({ tempStart = new Object3D(), ...props }: PredictionViewerProps) => {
    const predictionArrows = useMemo(() => predictionsToArrows(props.predictions, 1.5, 'red'), [props.predictions])

    const instancedMeshRef = useRef<any>()
    useEffect(() => {
        // Set positions
        predictionArrows.forEach((arrow, i) => {
            tempStart.position.set(arrow.start.x, arrow.start.y, arrow.start.z)
            tempStart.lookAt(arrow.end)
            tempStart.updateMatrix()
            instancedMeshRef.current.setMatrixAt(i, tempStart.matrix)
        })
        // Update the instance
        instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }, [])

    const arrow = customArrow(new Vector3(0, 1, 0), new Vector3(1, 1, 0), 0.02, 'blue')

    return (
        <instancedMesh ref={instancedMeshRef}>
            <group>
                <primitive object={arrow} />
            </group>
        </instancedMesh>
    )

    /*return (
        <group rotation={[0, 0, 0]}>
            {predictionArrows.map((arrow) => (
                <primitive key={`${arrow.position.x}${arrow.position.z}`} object={arrow} />
            ))}
        </group>
    )*/
}
