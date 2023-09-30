import { ObjectData, ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { ScenarioType } from '../../pages/SimulationPage'
import { Vec2 } from 'three'
import { sqrt } from 'three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements'

export type IntersectedObject = {
    intersection: Vec2
    object: ObjectDataWithPrediction
}

export class CollisionDetector {
    findCollision(egoPrediction: ObjectDataWithPrediction, objects: ObjectDataWithPrediction[]): IntersectedObject | null {
        const intersections = objects
            .map((object) => ({
                object,
                intersection: this.findIntersection(
                    object.predictions.map((p) => p.position),
                    egoPrediction.predictions.map((p) => p.position)
                ),
            }))
            .filter((i) => i.intersection !== null) as IntersectedObject[]

        if (intersections.length === 0) return null
        intersections.sort((a, b) => a.object.position.x ** 2 + a.object.position.y ** 2 - b.object.position.x ** 2 - b.object.position.y ** 2)
        return intersections[0]
    }

    lineIntersect(egoPos0: Vec2, egoPos1: Vec2, objectPos0: Vec2, objectPos1: Vec2) {
        const denom = (objectPos1.y - objectPos0.y) * (egoPos1.x - egoPos0.x) - (objectPos1.x - objectPos0.x) * (egoPos1.y - egoPos0.y)
        if (denom === 0) {
            return null
        }

        let ua = ((objectPos1.x - objectPos0.x) * (egoPos0.y - objectPos0.y) - (objectPos1.y - objectPos0.y) * (egoPos0.x - objectPos0.x)) / denom
        let ub = ((egoPos1.x - egoPos0.x) * (egoPos0.y - objectPos0.y) - (egoPos1.y - egoPos0.y) * (egoPos0.x - objectPos0.x)) / denom

        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return null
        }

        // Return a object with the x and y coordinates of the intersection
        let x = egoPos0.x + ua * (egoPos1.x - egoPos0.x)
        let y = egoPos0.y + ua * (egoPos1.y - egoPos0.y)

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
                if (intersection) return intersection
            }
        }
        return null
    }
}
