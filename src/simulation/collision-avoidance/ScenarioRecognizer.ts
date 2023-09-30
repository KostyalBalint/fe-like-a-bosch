import { ObjectDataWithPrediction } from '../../pages/DatasetSelectionPage'
import { IntersectedObject } from './CollisionDetector'
import { ScenarioType } from '../../pages/SimulationPage'
import { CPLA } from './CPLA'
import { CPTA } from './CPTA'
import { CPNCO } from './CPNCO'
import { EgoData } from './CollisionAvoidanceSimulation'

export interface ScenarioTypeChecker {
    type: ScenarioType
    check(ego: EgoData, intersectedObject: IntersectedObject): boolean
}

export class ScenarioRecognizer {
    checkers: ScenarioTypeChecker[] = [new CPLA(), new CPTA(), new CPNCO()]

    recognizeScenario(ego: EgoData, intersectedObject: IntersectedObject): ScenarioType | null {
        if (ego.position.distanceTo(intersectedObject.object.position) > 10) {
            return null
        }

        for (const checker of this.checkers) {
            if (checker.check(ego, intersectedObject)) {
                return checker.type
            }
        }

        return null
    }
}
