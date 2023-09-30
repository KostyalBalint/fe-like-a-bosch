import { animated, useSpring } from '@react-spring/three'

interface UnknownObjectProps {
    x: number
    y: number
    z?: number
    color?: string
    opacity?: number
    onClick?: () => void
}

export const UnknownObject = ({ x, y, z = 0, color = '#4d4d4d', opacity = 1, onClick }: UnknownObjectProps) => {
    const { position } = useSpring({
        position: [x, 0.5 + z, y],
    })

    return (
        // @ts-ignore
        <animated.mesh onClick={onClick} position={position}>
            <capsuleGeometry args={[0.3, 1, 10, 15]} />
            <meshStandardMaterial color={color} opacity={opacity} transparent={true} />
        </animated.mesh>
    )
}
