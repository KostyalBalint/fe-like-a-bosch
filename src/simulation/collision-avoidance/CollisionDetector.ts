import { ObjectData, ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { ScenarioType } from '../../pages/SimulationPage'
import { Vec2 } from 'three'
import { sqrt } from 'three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements'

export type IntersectedObject = {
    intersection: Vec2
    object: ObjectDataWithPrediction
}

export class CollisionDetector {
    findCollision(ego: ObjectDataWithPrediction, objects: ObjectDataWithPrediction[], timestamp: number): IntersectedObject | null {
        if (timestamp === 65.48331492) console.log(ego, objects)
        const intersections = objects
            .map((object) => ({
                object,
                intersection: this.findIntersection(
                    object.predictions.map((p) => p.position),
                    ego.predictions.map((p) => p.position)
                ),
            }))
            .filter((i) => i.intersection !== null) as IntersectedObject[]

        if (intersections.length === 0) return null
        intersections.sort((a, b) => a.object.position.x ** 2 + a.object.position.y ** 2 - b.object.position.x ** 2 - b.object.position.y ** 2)
        return intersections[0]
    }

    lineIntersect(a1: Vec2, a2: Vec2, b1: Vec2, b2: Vec2) {
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
    findIntersection(objectPredictions: Vec2[], egoPredictions: Vec2[]) {
        if (objectPredictions.length < 2 || egoPredictions.length < 2) return null

        for (let i = 0; i < objectPredictions.length - 1; i++) {
            const objectPos0 = objectPredictions[i]
            const objectPos1 = objectPredictions[i + 1]

            for (let j = 0; j < egoPredictions.length - 1; j++) {
                const egoPos0 = egoPredictions[j]
                const egoPos1 = egoPredictions[j + 1]
                const intersection = this.lineIntersect(egoPos0, egoPos1, objectPos0, objectPos1)
                if (intersection) {
                    console.log('Found intersection', intersection)
                    return intersection
                }
            }
        }
        return null
    }
}
