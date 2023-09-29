import { ObjectData } from '../../pages/DatasetSelectionPage'

const X_THRESHOLD = 10
const Y_THRESHOLD = 15
const VELOCITY_Y_DIFFERENCE_THRESHOLD = 1
const VELOCITY_X_STANDING_THRESHOLD = 1

function isRelevant(ego: ObjectData, object: ObjectData) {
    if (Math.abs(object.position.x) > X_THRESHOLD || Math.abs(object.position.y) > Y_THRESHOLD) return false
    if (Math.abs(ego.velocity.y + object.velocity.y) < VELOCITY_Y_DIFFERENCE_THRESHOLD && Math.abs(object.velocity.x) < VELOCITY_X_STANDING_THRESHOLD)
        return false
    return true
}

export class ObjectFilter {
    filterObjects(objects: ObjectData[]): ObjectData[] {
        let ego = objects[0]
        objects.filter((object) => isRelevant(ego, object))
        return objects
    }
}
