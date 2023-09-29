import { ObjectData, ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { Vector2 } from 'three'

const MAX_PREDICTION_SECONDS = 5

type ObjectDataWithTimeStamp = {
    objects: ObjectData[]
    timeStamp: number
}

type EgoDataWithTimeStamp = {
    velocity: number
    heading: number
    timeStamp: number
}
export class PredictionEngine {
    private allFilteredObjects: ObjectDataWithTimeStamp[] = []

    private allEgoData: EgoDataWithTimeStamp[] = []

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
        const deltaTime = this.getDt()
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
        const ax = (lastVelocity.x - secondLastVelocity.x) * deltaTime
        const ay = (lastVelocity.y - secondLastVelocity.y) * deltaTime

        const t = relativeTimeDiff // If distance is the time step, for simplicity
        const predictedX = lastPoint.x + lastVelocity.x * t + 0.5 * ax * t * t
        const predictedY = lastPoint.y + lastVelocity.y * t + 0.5 * ay * t * t

        return { position: new Vector2(predictedX, predictedY), timestamp: t }
    }

    private getHistory(object: ObjectData) {
        return this.allFilteredObjects.map((objects) => objects.objects.find((o) => o.id === object.id))
    }

    private getDt() {
        const length = this.allFilteredObjects.length
        return length < 2 ? 0 : this.allFilteredObjects[length - 1].timeStamp - this.allFilteredObjects[length - 2].timeStamp
    }

    private getEgoDt() {
        const length = this.allEgoData.length
        return length < 10 ? 0 : this.allEgoData[length - 1].timeStamp - this.allEgoData[length - 8].timeStamp
    }

    predictEgo(vehicleSpeed: number, heading: number, timeStamp: number) {
        this.allEgoData.push({ velocity: vehicleSpeed, heading, timeStamp })
        return Array.from({ length: MAX_PREDICTION_SECONDS * 5 }).map((_, idx) => this.predictLocationForEgo(idx / 5))
    }

    private predictLocationForEgo(relativeTimeDiff: number) {
        const deltaTime = this.getEgoDt()
        const historyLength = this.allEgoData.length
        if (this.allEgoData.length < 10) {
            return {
                position: new Vector2(0, 0),
                timestamp: 0,
            }
        }
        const lastHeading = this.allEgoData[historyLength - 1]!.heading
        const lastVelocity = this.allEgoData[historyLength - 1]!.velocity
        const secondLastHeading = this.allEgoData[historyLength - 8]!.heading
        const secondLastVelocity = this.allEgoData[historyLength - 8]!.velocity

        const lastVelocityVector = this.getVelocityVector(lastHeading, lastVelocity)
        const secondLastVelocityVector = this.getVelocityVector(secondLastHeading, secondLastVelocity)

        // Assuming constant acceleration for simplicity
        const ax = (lastVelocityVector.x - secondLastVelocityVector.x) * deltaTime
        const ay = (lastVelocityVector.y - secondLastVelocityVector.y) * deltaTime

        const t = relativeTimeDiff // If distance is the time step, for simplicity
        const predictedX = lastVelocityVector.x + lastVelocityVector.x * t + 0.5 * ax * t * t
        const predictedY = lastVelocityVector.y + lastVelocityVector.y * t + 0.5 * ay * t * t

        return { position: new Vector2(predictedX, predictedY), timestamp: t }
    }
    private getVelocityVector(secondLastHeading: number, secondLastVelocity: number) {
        return new Vector2(secondLastVelocity, 0).rotateAround(new Vector2(0, 0), -secondLastHeading)
    }
}
