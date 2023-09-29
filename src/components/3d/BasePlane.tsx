import { Html } from '@react-three/drei'
import React, { createRef, useEffect, useMemo, useState } from 'react'
import { DoubleSide, GridHelper, Object3D, Vector2, Vector3 } from 'three'
import { customArrow } from './helpers/customArrow'
import { Paper } from '@mui/material'
import { useSpring, animated, useSpringValue } from '@react-spring/three'

const ToolTip = (props: { position: Vector3; text: string }) => {
    return (
        <Html center position={props.position}>
            <Paper sx={{ p: 0.5 }}>{props.text}</Paper>
        </Html>
    )
}

const AxesHelper = (props: { length: number; thickness: number; arrowPos: Vector3 }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const vecX = useMemo(() => customArrow(props.arrowPos, new Vector3(props.length, 0, 0), props.thickness, 0xf01616), [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const vecY = useMemo(() => customArrow(props.arrowPos, new Vector3(0, props.length, 0), props.thickness, 0x28f016), [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const vecZ = useMemo(() => customArrow(props.arrowPos, new Vector3(0, 0, props.length), props.thickness, 0x1666f0), [])

    return (
        <>
            <primitive object={vecX} />
            <primitive object={vecY} />
            <primitive object={vecZ} />
            <ToolTip position={new Vector3(props.length + 0.1, 0, 0)} text="X" />
            <ToolTip position={new Vector3(0, props.length + 0.1, 0)} text="Y" />
            <ToolTip position={new Vector3(0, 0, props.length + 0.1)} text="Z" />
        </>
    )
}

interface BasePlaneProps {
    carPosition: Vector2
}

export function BasePlane(props: BasePlaneProps) {
    const { position } = useSpring({
        position: [-props.carPosition.x, 0, -props.carPosition.y],
    })

    return (
        // @ts-ignore
        <animated.mesh position={position}>
            <meshPhongMaterial color="royalblue" />
            <gridHelper args={[5000, 5000]}>
                <meshBasicMaterial color="#666666" side={DoubleSide} />
            </gridHelper>
        </animated.mesh>
    )
}
