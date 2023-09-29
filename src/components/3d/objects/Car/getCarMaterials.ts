import { ColorRepresentation, MeshPhysicalMaterial, MeshStandardMaterial } from 'three'

export const getCarMaterials = (color: ColorRepresentation, opacity: number) => {
    const bodyMaterial = new MeshPhysicalMaterial({
        color: color,
        opacity: opacity,
        transparent: opacity < 1,
        metalness: 1.0,
        roughness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        sheen: 0.5,
    })

    const interialMaterial = new MeshStandardMaterial({
        color: 0x737a80,
        metalness: 0.5,
    })

    const detailsMaterial = new MeshStandardMaterial({
        color: 0xffffff,
        opacity: opacity,
        transparent: opacity < 1,
        metalness: 1.0,
        roughness: 0.5,
    })

    const glassMaterial = new MeshPhysicalMaterial({
        color: 0xffffff,
        opacity: opacity,
        transparent: opacity < 1,
        metalness: 0.25,
        roughness: 0,
        transmission: 1.0,
    })

    return {
        bodyMaterial,
        interialMaterial,
        detailsMaterial,
        glassMaterial,
    }
}
