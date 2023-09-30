import { Vector2 } from 'three'
import { ObjectDataWithPrediction, Prediction } from '../../pages/dataset-selection/types'

const MAX_DISTANCE = 15
const CAR_WIDTH = 1.8

export type IntersectedObject = {
    intersection: Vector2
    object: ObjectDataWithPrediction
}

export class CollisionDetector {
    findCollision(ego: ObjectDataWithPrediction, objects: ObjectDataWithPrediction[], timestamp: number): IntersectedObject | null {
        const intersections = objects
            .map((object) => ({
                object,
                intersection: this.findIntersection(object.predictions, ego),
            }))
            .filter((i) => i.intersection !== null) as IntersectedObject[]

        const runOnInteractions = objects
            .map((object) => ({
                object,
                intersection: this.identifyRunOn(ego.velocity, object.position),
            }))
            .filter((i) => i.intersection !== null) as IntersectedObject[]

        const allColisionList = intersections.concat(...runOnInteractions)

        if (allColisionList.length === 0) return null
        allColisionList.sort((a, b) => a.object.position.x ** 2 + a.object.position.y ** 2 - b.object.position.x ** 2 - b.object.position.y ** 2)
        return allColisionList[0]
    }

    lineIntersect(a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2) {
        const denom = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (-a2.y - -a1.y)
        if (denom === 0) {
            return null
        }

        let ua = ((b2.x - b1.x) * (-a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)) / denom
        let ub = ((a2.x - a1.x) * (-a1.y - b1.y) - (-a2.y - -a1.y) * (a1.x - b1.x)) / denom

        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return null
        }

        // Return a object with the x and y coordinates of the intersection
        let x = a1.x + ua * (a2.x - a1.x)
        let y = -a1.y + ua * (-a2.y - -a1.y)

        return { x, y, ua, ub }
    }

    findIntersection(objectPredictions: Prediction[], ego: ObjectDataWithPrediction) {
        if (objectPredictions.length < 2 || ego.predictions.length < 2) return null

        for (let i = 0; i < objectPredictions.length - 1; i++) {
            const objectPos0 = objectPredictions[i]
            const objectPos1 = objectPredictions[i + 1]

            for (let j = 0; j < ego.predictions.length - 1; j++) {
                const egoPos0 = ego.predictions[j]
                const egoPos1 = ego.predictions[j + 1]
                const intersection = this.lineIntersect(egoPos0.position, egoPos1.position, objectPos0.position, objectPos1.position)
                if (intersection) {
                    const egoTime = (egoPos1.timestamp - egoPos0.timestamp) * intersection?.ua
                    const objectTime = (objectPos1.timestamp - objectPos0.timestamp) * intersection?.ub

                    const timeDiff = Math.abs(egoTime - objectTime)

                    const LENGTH = 4
                    const threshold = LENGTH / ego.velocity.length()

                    if (timeDiff < threshold) {
                        return { x: intersection.x, y: intersection.y }
                    }
                }
            }
        }
        return null
    }

    identifyRunOn(egoVelocity: Vector2, objectPosition: Vector2) {
        const normalizedEgoVelocity = egoVelocity.clone().normalize()
        const egoEndpoint = normalizedEgoVelocity.multiplyScalar(MAX_DISTANCE)
        const distance = this.distanceBetweenPointAndLineSegment(objectPosition.x, objectPosition.y, 0, 0, egoEndpoint.x, egoEndpoint.y)
        if (distance < CAR_WIDTH / 2) {
            return objectPosition
        }
        return null
    }

    distanceBetweenPointAndLineSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1
        const dy = y2 - y1

        // Calculate the parametric value (t) of the point on the line segment
        const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)

        // Check if the closest point is within the line segment
        if (t >= 0 && t <= 1) {
            const x_closest = x1 + t * dx
            const y_closest = y1 + t * dy

            // Calculate the Euclidean distance between the closest point and the given point
            const distance = Math.sqrt((x - x_closest) ** 2 + (y - y_closest) ** 2)

            return distance
        } else {
            // The closest point is outside the line segment; calculate the distance to the nearest endpoint
            const distanceToEndpoint1 = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2)
            const distanceToEndpoint2 = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2)

            // Return the minimum of the distances to the endpoints
            return Math.min(distanceToEndpoint1, distanceToEndpoint2)
        }
    }
}
