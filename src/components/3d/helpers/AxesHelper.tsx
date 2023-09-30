import { Vector3 } from 'three'
import React, { useMemo } from 'react'
import { customArrow } from './customArrow'
import { Html } from '@react-three/drei'
import { Paper } from '@mui/material'

const ToolTip = (props: { position: Vector3; text: string }) => {
    return (
        <Html center position={props.position}>
            <Paper sx={{ p: 0.5 }}>{props.text}</Paper>
        </Html>
    )
}

export const AxesHelper = (props: { length: number; thickness: number; arrowPos: Vector3 }) => {
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
