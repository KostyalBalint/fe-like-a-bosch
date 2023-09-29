import { ObjectDataWithPrediction } from '../../pages/DatasetSelectionPage'
import { AvoidanceData, ScenarioType } from '../../pages/SimulationPage'

export class AvoidanceCalculator {
    calculateAvoidanceData(ego: ObjectDataWithPrediction, objects: ObjectDataWithPrediction[], scenarioType: ScenarioType | null): AvoidanceData {
        return {
            decelerationNeeded: 0,
            brakeDistance: 0,
            signal: null,
        }
    }
}
