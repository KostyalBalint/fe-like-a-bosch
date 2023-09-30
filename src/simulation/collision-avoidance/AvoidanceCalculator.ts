import { ObjectDataWithPrediction } from '../../pages/DatasetSelectionPage'
import { AvoidanceData, ScenarioType } from '../../pages/SimulationPage'
import { IntersectedObject } from './CollisionDetector'

export class AvoidanceCalculator {
    calculateAvoidanceData(ego: ObjectDataWithPrediction, intersectedObject: IntersectedObject | null): AvoidanceData {
        return {
            decelerationNeeded: 0,
            brakeDistance: 0,
            signal: null,
        }
    }
}
