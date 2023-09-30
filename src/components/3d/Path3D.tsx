import { CatmullRomCurve3, TubeGeometry, Vector2, Vector3 } from 'three'
import { gradientMaterial } from './helpers/gradientMaterial'

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

    const tubeGeometry = new TubeGeometry(curve, 100, props.radius, 10, props.closed)
    tubeGeometry.scale(1, 0.05, 1)
    return (
        <mesh>
            <primitive object={tubeGeometry} attach="geometry" />
            <primitive object={gradientMaterial} attach="material" />
        </mesh>
    )
}
