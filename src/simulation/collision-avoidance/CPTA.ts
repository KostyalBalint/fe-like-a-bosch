import { ScenarioTypeChecker } from './ScenarioRecognizer'
import { IntersectedObject } from './CollisionDetector'
import { EgoData } from './CollisionAvoidanceSimulation'
import { ScenarioType } from '../../pages/dataset-selection/types'

const YEW_RATE_THRESHOLD = 0.18
export class CPTA implements ScenarioTypeChecker {
    type = ScenarioType.CPTA

    check(ego: EgoData, intersectedObject: IntersectedObject): boolean {
        return ego.yawRate > YEW_RATE_THRESHOLD
    }
}
