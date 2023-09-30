import { CatmullRomCurve3, Color, TubeGeometry, Vector2, Vector3 } from 'three'
import { createGradientMaterial } from './helpers/gradientMaterial'
import { useMemo } from 'react'

interface Path3DParams {
    path: Vector2[]
    pathHeight: number
    closed?: boolean
    radius?: number
    color?: Color
    toOpacity?: number
}

export const Path3D = (props: Path3DParams) => {
    const curve = new CatmullRomCurve3(
        props.path.map((p) => new Vector3(p.x, props.pathHeight, p.y)),
        false
    )

    const gradientMaterial = useMemo(
        () => createGradientMaterial(props.color ?? new Color('#a9c5fd'), props.toOpacity),
        [props.color, props.toOpacity]
    )

    const tubeGeometry = new TubeGeometry(curve, 100, props.radius, 10, props.closed)
    tubeGeometry.scale(1, 0.05, 1)
    return (
        <mesh position={[0, props.pathHeight, 0]}>
            <primitive object={tubeGeometry} attach="geometry" />
            <primitive object={gradientMaterial} attach="material" />
        </mesh>
    )
}
