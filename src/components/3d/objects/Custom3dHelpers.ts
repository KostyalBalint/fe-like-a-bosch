import { Mesh, Object3D } from 'three'

export const makeMaterialsTransparent = (modell: Object3D, opacity: number) => {
    modell.traverse((object) => {
        if (object instanceof Mesh) {
            object.material.opacity = opacity
            object.material.transparent = opacity < 1
        }
    })
}
