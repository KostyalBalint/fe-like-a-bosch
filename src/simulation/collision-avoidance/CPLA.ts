import { IntersectedObject } from './CollisionDetector'
import { ScenarioTypeChecker } from './ScenarioRecognizer'
import { EgoData } from './CollisionAvoidanceSimulation'
import { ScenarioType } from '../../pages/dataset-selection/types'

const ANGLE_THRESHOLD = 15
export class CPLA implements ScenarioTypeChecker {
    type = ScenarioType.CPLA

    check(ego: EgoData, intersectedObject: IntersectedObject): boolean {
        const egoHeading = ego.velocity.angle()
        const objectHeading = intersectedObject.object.velocity.angle()
        return Math.abs(egoHeading - objectHeading) < (ANGLE_THRESHOLD * Math.PI) / 180
    }
}
