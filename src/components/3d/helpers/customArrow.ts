import { ColorRepresentation, ConeGeometry, CylinderGeometry, Group, Mesh, MeshPhongMaterial, Vector3 } from 'three'

const ARROW_BODY = new CylinderGeometry(1, 1, 1, 12).rotateX(Math.PI / 2).translate(0, 0, 0.5)

const ARROW_HEAD = new ConeGeometry(1, 1, 12).rotateX(Math.PI / 2).translate(0, 0, -0.5)

export const customArrow = (start: Vector3, end: Vector3, thickness: number, color: ColorRepresentation) => {
    const material = new MeshPhongMaterial({ color: color })

    const length = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2 + (start.z - end.z) ** 2)

    const body = new Mesh(ARROW_BODY, material)
    body.scale.set(thickness, thickness, length - 10 * thickness)

    const head = new Mesh(ARROW_HEAD, material)
    head.position.set(0, 0, length)
    head.scale.set(3 * thickness, 3 * thickness, 10 * thickness)

    const arrow = new Group()
    arrow.position.set(start.x, start.y, start.z)
    arrow.lookAt(end)
    arrow.add(body, head)

    return arrow
}
