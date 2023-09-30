import { ObjectDataWithPrediction } from '../../pages/DatasetSelectionPage'
import { IntersectedObject } from './CollisionDetector'
import { ScenarioType } from '../../pages/SimulationPage'

export class ScenarioRecognizer {
    recognizeScenario(ego: ObjectDataWithPrediction, intersectedObject: IntersectedObject): ScenarioType | null {
        if (Math.sqrt(intersectedObject.intersection.x ** 2 + intersectedObject.intersection.y ** 2) < 5) {
        }

        return ScenarioType.CPLA
    }
}
