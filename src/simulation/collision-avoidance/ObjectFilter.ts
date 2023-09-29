import { ObjectData } from '../../pages/DatasetSelectionPage'

export class ObjectFilter {
    filterObjects(objects: ObjectData[]): ObjectData[] {
        return objects.filter((o) => o.position.x !== 0 || o.position.y !== 0)
    }
}
