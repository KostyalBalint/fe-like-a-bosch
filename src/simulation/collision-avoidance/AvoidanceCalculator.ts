import { ObjectDataWithPrediction } from '../../pages/DatasetSelectionPage'
import { AvoidanceData, ScenarioType, Signal } from '../../pages/SimulationPage'
import { IntersectedObject } from './CollisionDetector'
import { Vector2 } from 'three'

const MAX_JERK = -30
const MAX_DECELERATION = -9
const LIGHT_THRESHOLD = 3
const HORN_THRESHOLD = 6

export class AvoidanceCalculator {
    calculateAvoidanceData(ego: ObjectDataWithPrediction, intersectedObject: IntersectedObject | null): AvoidanceData {
        let decelerationNeeded = 0
        let signal = null
        if (intersectedObject) {
            const predictionPoints = ego.predictions.map((prediction) => prediction.position)
            const distance = this.calculateDistance(predictionPoints, intersectedObject!.intersection)
            decelerationNeeded = ego.velocity.lengthSq() / (2 * distance)
            signal = this.calculateSignal(decelerationNeeded)
        }
        //const breakDistance = calculateBreakDistance(ego.velocity.lengthSq(), MAX_DECELERATION)

        return {
            decelerationNeeded: decelerationNeeded,
            brakeDistance: 0,
            signal: signal,
        }
    }

    calculateDistance(predictions: Vector2[], intersectedObject: Vector2) {
        let i = 0
        let distance = 0
        while (
            this.isPointOnLineSegment(
                intersectedObject.x,
                intersectedObject.y,
                predictions[i].x,
                predictions[i].y,
                predictions[i + 1].x,
                predictions[i + 1].y
            )
        ) {
            distance += predictions[i].distanceTo(predictions[i + 1])
            i++
        }
        distance += predictions[i].distanceTo(intersectedObject)
        return distance
    }

    calculateSignal(declarationNeeded: number) {
        if (declarationNeeded > HORN_THRESHOLD) return Signal.HORN
        if (declarationNeeded > LIGHT_THRESHOLD) return Signal.HEADLIGHT_FLASH
        return null
    }

    isPointOnLineSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
        const t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2)
        return t >= 0 && t <= 1
    }
}
