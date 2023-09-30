import { Vector2 } from 'three'
import { ObjectDataWithPrediction } from '../../pages/dataset-selection/types'

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
                intersection: this.findIntersection(
                    object.predictions.map((p) => p.position),
                    ego.predictions.map((p) => p.position)
                ),
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

        return { x, y }
    }

    planeIntersect(a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2) {
        const i1 = this.lineIntersect(a1, a2, b1, b2)
        if (i1) return i1
        const i2 = this.lineIntersect(a1, b1, a2, b2)
        if (i2) return i2
        const i3 = this.lineIntersect(a1, b2, a2, b1)
        if (i3) return i3
        const i4 = this.lineIntersect(a2, b1, a1, b2)
        if (i4) return i4
    }

    lineIntersectWithWidth(a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2, aWidth: number, bWidth: number) {
        function offsetLine(start: Vector2, end: Vector2, offset: number) {
            //Offset the line by the offset value in the perpendicular direction
            const dx = end.x - start.x
            const dy = end.y - start.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const ux = dx / len
            const uy = dy / len
            return {
                start: new Vector2(start.x + offset * uy, start.y - offset * ux),
                end: new Vector2(end.x + offset * uy, end.y - offset * ux),
            }
        }

        const a1Offset = offsetLine(a1, a2, aWidth / 2)
        const a2Offset = offsetLine(a1, a2, -aWidth / 2)

        const b1Offset = offsetLine(b1, b2, bWidth / 2)
        const b2Offset = offsetLine(b1, b2, -bWidth / 2)

        return this.planeIntersect(a1Offset.start, a2Offset.end, b1Offset.start, b2Offset.end)
    }

    findIntersection(objectPredictions: Vector2[], egoPredictions: Vector2[]) {
        if (objectPredictions.length < 2 || egoPredictions.length < 2) return null

        const egoWidth = 1.5
        const objectWidth = 1

        for (let i = 0; i < objectPredictions.length - 1; i++) {
            const objectPos0 = objectPredictions[i]
            const objectPos1 = objectPredictions[i + 1]

            for (let j = 0; j < egoPredictions.length - 1; j++) {
                const egoPos0 = egoPredictions[j]
                const egoPos1 = egoPredictions[j + 1]
                const intersection = this.lineIntersect(egoPos0, egoPos1, objectPos0, objectPos1)
                if (intersection) {
                    return intersection
                }
            }
        }
        return null
    }

    identifyRunOn(egoVelocity: Vector2, objectPosition: Vector2) {
        const normalizedEgoVelocity = egoVelocity.clone().normalize()
        const egoEndpoint = normalizedEgoVelocity.multiplyScalar(MAX_DISTANCE)
        const distance = this.distanceBetweenPointAndLineSegment(objectPosition.x, objectPosition.y, 0, 0, egoEndpoint.x, egoEndpoint.y)
        console.log(distance)
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
