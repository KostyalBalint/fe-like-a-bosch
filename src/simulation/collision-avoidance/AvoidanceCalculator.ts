import { IntersectedObject } from './CollisionDetector'
import { Vector2 } from 'three'
import { AvoidanceData, ObjectDataWithPrediction, Signal } from '../../pages/dataset-selection/types'

const MAX_JERK = -30
const MAX_DECELERATION = -9
const LIGHT_THRESHOLD = 1.6
const HORN_THRESHOLD = 1.85
const T_LATENCY = 0.1
export class AvoidanceCalculator {
    egoVelocityHistory: Vector2[] = []
    timestampHistory: number[] = []
    calculateAvoidanceData(ego: ObjectDataWithPrediction, intersectedObject: IntersectedObject | null, timestamp: number): AvoidanceData {
        let decelerationNeeded = 0
        let signal = null
        if (intersectedObject) {
            const predictionPoints = ego.predictions.map((prediction) => prediction.position)
            const distance = this.calculateDistance(predictionPoints, intersectedObject!.intersection)
            decelerationNeeded = ego.velocity.lengthSq() / (2 * distance)
            signal = this.calculateSignal(decelerationNeeded)
        }
        this.egoVelocityHistory.push(ego.velocity)
        this.timestampHistory.push(timestamp)
        let aEgo = 0
        if (this.egoVelocityHistory.length > 1) {
            const lastVelocity = this.egoVelocityHistory[this.egoVelocityHistory.length - 1]
            const secondLastVelocity = this.egoVelocityHistory[this.egoVelocityHistory.length - 2]
            const lastTimestamp = this.timestampHistory[this.timestampHistory.length - 1]
            const secondLastTimestamp = this.timestampHistory[this.timestampHistory.length - 2]
            aEgo = (lastVelocity.lengthSq() - secondLastVelocity.lengthSq()) / (lastTimestamp - secondLastTimestamp)
        }

        const breakDistance = this.calculateBreakDistance(Math.max(aEgo, -9), ego.velocity.length())

        return {
            decelerationNeeded: decelerationNeeded,
            brakeDistance: breakDistance,
            signal: signal,
        }
    }

    /**
     * Calculation based on the formulas from the challenge handout
     * @param aEgo
     * @param vEgo
     */
    calculateBreakDistance(aEgo: number, vEgo: number) {
        const d1 = vEgo * T_LATENCY + (aEgo * T_LATENCY ** 2) / 2
        const t2 = (MAX_DECELERATION - aEgo) / MAX_JERK
        const dv1 = (MAX_JERK / 2) * t2 ** 2 + aEgo * t2
        const v1 = vEgo + dv1
        const d2 = (MAX_JERK / 6) * t2 ** 3 + (aEgo / 2) * t2 ** 2 + vEgo * t2
        const dv2 = -v1
        const t3 = dv2 / MAX_DECELERATION
        const d3 = (MAX_DECELERATION / 2) * t3 ** 2 + v1 * t3
        return d1 + d2 + d3
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
