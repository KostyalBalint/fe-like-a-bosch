import { ObjectData, ObjectDataWithPrediction, Prediction } from '../../pages/DatasetSelectionPage'
import { Vector2 } from 'three'

const MAX_PREDICTION_SECONDS = 10

export class PredictionEngine {
    predictAll(objects: ObjectData[]): ObjectDataWithPrediction[] {
        return objects.map((o) => this.generatePredictionsForObject(o))
    }

    generatePredictionsForObject(object: ObjectData): ObjectDataWithPrediction {
        return {
            ...object,
            predictions: Array.from({ length: MAX_PREDICTION_SECONDS * 10 }).map((_, idx) => this.predictLocation(object, idx / 10)),
        }
    }

    private predictLocation(object: ObjectData, relativeTimeDiff: number): Prediction {
        return {
            position: new Vector2(0, 0),
            timestamp: 0,
        }
    }
}
