import { ScenarioType } from '../../pages/SimulationPage'
import { ObjectDataWithPrediction } from '../../pages/DatasetSelectionPage'
import { IntersectedObject } from './CollisionDetector'
import { ScenarioTypeChecker } from './ScenarioRecognizer'
import { EgoData } from './CollisionAvoidanceSimulation'

const ANGLE_THRESHOLD = 20
export class CPLA implements ScenarioTypeChecker {
    type = ScenarioType.CPLA

    check(ego: EgoData, intersectedObject: IntersectedObject): boolean {
        const egoHeading = ego.velocity.angle()
        const objectHeading = intersectedObject.object.velocity.angle()
        return Math.abs(egoHeading - objectHeading) < (ANGLE_THRESHOLD * Math.PI) / 180
    }
}
