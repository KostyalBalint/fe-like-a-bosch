import { ObjectData, ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { Vector2 } from 'three'

const MAX_PREDICTION_SECONDS = 10

export class PredictionEngine {
    private allFilteredObjects: ObjectData[][] = []

    predictAll(objects: ObjectData[]): ObjectDataWithPrediction[] {
        this.allFilteredObjects.push(objects)
        return objects.map((o) => this.generatePredictionsForObject(o))
    }

    generatePredictionsForObject(object: ObjectData): ObjectDataWithPrediction {
        return {
            ...object,
            predictions: Array.from({ length: MAX_PREDICTION_SECONDS * 10 }).map((_, idx) => this.predictLocation(object, idx / 10)),
        }
    }

    private predictLocation(object: ObjectData, relativeTimeDiff: number): Prediction {
        const history = this.getHistory(object)
        if (history.length < 2) {
            return {
                position: new Vector2(0, 0),
                timestamp: 0,
            }
        }

        const lastPoint = history[history.length - 1]!.position
        const lastVelocity = history[history.length - 1]!.velocity

        // Assuming constant acceleration for simplicity
        const secondLastVelocity = history[history.length - 2]!.velocity
        const ax = (lastVelocity.x - secondLastVelocity.x) * 0.1
        const ay = (lastVelocity.y - secondLastVelocity.y) * 0.1

        const t = relativeTimeDiff // If distance is the time step, for simplicity
        const predictedX = lastPoint.x + lastVelocity.x * t + 0.5 * ax * t * t
        const predictedY = lastPoint.y + lastVelocity.y * t + 0.5 * ay * t * t

        return { position: new Vector2(predictedX, predictedY), timestamp: t }
    }

    private getHistory(object: ObjectData) {
        return this.allFilteredObjects.map((objects) => objects.find((o) => o.id === object.id))
    }
}
