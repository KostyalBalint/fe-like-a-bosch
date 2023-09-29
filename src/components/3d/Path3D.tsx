import { BufferGeometry, CatmullRomCurve3, LineBasicMaterial, MeshPhysicalMaterial, TubeGeometry, Vector2, Vector3 } from 'three'
import { createRef } from 'react'

interface Path3DParams {
    path: Vector2[]
    pathHeight: number
    closed?: boolean
    radius?: number
}

export const Path3D = (props: Path3DParams) => {
    const curve = new CatmullRomCurve3(
        props.path.map((p) => new Vector3(p.x, props.pathHeight, p.y)),
        false
    )

    //const geometry = new BufferGeometry().setFromPoints(points)
    const tubeGeometry = new TubeGeometry(curve, 100, props.radius, 10, props.closed)

    const bodyMaterial = new MeshPhysicalMaterial({
        color: '#4287f5',
        opacity: 1,
        transparent: false,
        metalness: 1.0,
        roughness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        sheen: 0.5,
    })

    return (
        <mesh>
            <primitive object={tubeGeometry} attach="geometry" />
            <meshPhysicalMaterial attach="material" color="#4287f5" />
        </mesh>
    )
}
