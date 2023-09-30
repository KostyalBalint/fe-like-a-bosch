import { IntersectedObject } from './CollisionDetector'
import { CPLA } from './CPLA'
import { CPTA } from './CPTA'
import { CPNCO } from './CPNCO'
import { EgoData } from './CollisionAvoidanceSimulation'
import { ScenarioType } from '../../pages/dataset-selection/types'

export interface ScenarioTypeChecker {
    type: ScenarioType
    check(ego: EgoData, intersectedObject: IntersectedObject): boolean
}

const WARNING_DISTANCE = 15

export class ScenarioRecognizer {
    checkers: ScenarioTypeChecker[] = [new CPLA(), new CPTA(), new CPNCO()]

    recognizeScenario(ego: EgoData, intersectedObject: IntersectedObject): ScenarioType | null {
        if (intersectedObject.object.position.length() > WARNING_DISTANCE) {
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
