import { ScenarioTypeChecker } from './ScenarioRecognizer'
import { ScenarioType } from '../../pages/SimulationPage'
import { IntersectedObject } from './CollisionDetector'
import { EgoData } from './CollisionAvoidanceSimulation'

const ANGLE_THRESHOLD = 30
export class CPNCO implements ScenarioTypeChecker {
    type = ScenarioType.CPNCO

    check(ego: EgoData, intersectedObject: IntersectedObject): boolean {
        const egoHeading = ego.velocity.angle()
        const objectHeading = intersectedObject.object.velocity.angle()

        console.log(Math.abs(Math.abs(egoHeading - objectHeading) - Math.PI / 2) * (180 / Math.PI))

        return Math.abs(Math.abs(egoHeading - objectHeading) - Math.PI / 2) < (ANGLE_THRESHOLD * Math.PI) / 180
    }
}
