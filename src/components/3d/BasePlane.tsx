import { Html } from '@react-three/drei'
import React, { createRef, useMemo } from 'react'
import { DoubleSide, GridHelper, Object3D, Vector2, Vector3 } from 'three'
import { customArrow } from './helpers/customArrow'
import { Paper } from '@mui/material'
import { useFrame } from '@react-three/fiber'

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
    velocity?: Vector2
}

export function BasePlane(props: BasePlaneProps) {
    const ref = createRef<GridHelper>()
    useFrame((state, delta, frame) => {
        if (ref?.current) {
            ref.current.position.x -= delta * (props.velocity?.x ?? 0)
            ref.current.position.z -= delta * (props.velocity?.y ?? 0)
        }
    })
    return (
        <gridHelper ref={ref} args={[5000, 5000]}>
            <meshBasicMaterial color="#666666" side={DoubleSide} />
        </gridHelper>
    )
}
