import React from 'react'
import { DoubleSide, Vector2 } from 'three'
import { animated, useSpring } from '@react-spring/three'

interface BasePlaneProps {
    carPosition: Vector2
}

export function BasePlane(props: BasePlaneProps) {
    const { position } = useSpring({
        position: [-props.carPosition.x, 0, props.carPosition.y],
    })

    return (
        // @ts-ignore
        <animated.mesh position={position}>
            <meshPhongMaterial color="royalblue" />
            <gridHelper args={[5000, 5000]}>
                <meshBasicMaterial color="#333" side={DoubleSide} />
            </gridHelper>
        </animated.mesh>
    )
}
