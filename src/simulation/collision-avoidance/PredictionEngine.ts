import { ObjectData, ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { Vector2 } from 'three'

const MAX_PREDICTION_SECONDS = 5

type ObjectDataWithTimeStamp = {
    objects: ObjectData[]
    timeStamp: number
}

export class PredictionEngine {
    private allFilteredObjects: ObjectDataWithTimeStamp[] = []

    predictAll(objects: ObjectData[], timeStamp: number): ObjectDataWithPrediction[] {
        this.allFilteredObjects.push({ objects, timeStamp })
        return objects.map((o) => this.generatePredictionsForObject(o))
    }

    generatePredictionsForObject(object: ObjectData): ObjectDataWithPrediction {
        return {
            ...object,
            predictions: Array.from({ length: MAX_PREDICTION_SECONDS * 5 }).map((_, idx) => this.predictLocation(object, idx / 5)),
        }
    }

    private predictLocation(object: ObjectData, relativeTimeDiff: number): Prediction {
        const history = this.getHistory(object)
        const window = 10
        const count = 15
        if (history.length < window + count - 1) {
            return {
                position: new Vector2(0, 0),
                timestamp: 0,
            }
        }

        const actualPosition = history[history.length - 1].object!.position
        const actualVelocity = history[history.length - 1].object!.velocity

        const movingAverageAcceleration = this.getMovingAverageAcceleration(history, window, count)
        const weightedMovingAverageAcceleration = movingAverageAcceleration.map((a, idx) => {
            const weight = movingAverageAcceleration.length - idx
            return new Vector2(a.x * weight, a.y * weight)
        })
        const totalWeight = ((movingAverageAcceleration.length + 1) / 2) * movingAverageAcceleration.length
        const ax = weightedMovingAverageAcceleration.reduce((acc, a) => acc + a.x, 0) / totalWeight
        const ay = weightedMovingAverageAcceleration.reduce((acc, a) => acc + a.y, 0) / totalWeight

        const t = relativeTimeDiff // If distance is the time step, for simplicity
        const predictedX = actualPosition.x + actualVelocity.x * t + 0.5 * ax * t * t
        const predictedY = actualPosition.y + actualVelocity.y * t + 0.5 * ay * t * t

        return { position: new Vector2(predictedX, predictedY), timestamp: t }
    }

    private getHistory(object: ObjectData) {
        return this.allFilteredObjects
            .map((objects) => ({ object: objects.objects.find((o) => o.id === object.id), timestamp: objects.timeStamp }))
            .filter((o) => o.object)
    }

    private getMovingAverageAcceleration(history: { object: ObjectData | undefined; timestamp: number }[], window: number, count: number) {
        if (history.length < window) {
            return [new Vector2(0, 0)]
        }
        const averages = []
        for (let i = 0; i < count; i++) {
            const last = history[history.length - 1 - i]
            const first = history[history.length - window - i]
            const deltaTime = last.timestamp - first.timestamp
            const deltaVelocity = new Vector2(last.object!.velocity.x - first.object!.velocity.x, last.object!.velocity.y - first.object!.velocity.y)
            averages.push(new Vector2(deltaVelocity.x / deltaTime, deltaVelocity.y / deltaTime))
        }
        return averages
    }
}
