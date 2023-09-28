import { Stack } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Vector2 } from 'three'
import { View3D } from '../components/3d/View3D'
import { ObjectDataWithPrediction } from './DatasetSelectionPage'
import { PlaybackControl } from '../components/PlaybackControl'
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

enum ScenarioType {
    CPNCO = 'CPNCO',
    CPTA = 'CPTA',
    CPLA = 'CPLA',
}

enum Signal {
    HORN = 'HORN',
    HEADLIGHT_FLASH = 'HEADLIGHT_FLASH',
}

interface AvoidanceData {
    signal: Signal
    brakeDistance: number
    decelerationNeeded: number
}

interface SimulationResult {
    ego: ObjectDataWithPrediction
    objects: ObjectDataWithPrediction[]
    scenarioType: ScenarioType
    avoidanceData: AvoidanceData
    timestamp: number
}

type SimulationPageProps = {
    values: SimulationResult[]
}

export enum KeyboardsControls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
}

export const SimulationPage = (props: SimulationPageProps) => {
    const [currentSimulationStep, setCurrentSimulationStep] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            //setCurrentSimulationStep((step) => step + 1)
        }, 100)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const map = useMemo<KeyboardControlsEntry<KeyboardsControls>[]>(
        () => [
            { name: KeyboardsControls.forward, keys: ['ArrowUp', 'KeyW'] },
            { name: KeyboardsControls.back, keys: ['ArrowDown', 'KeyS'] },
            { name: KeyboardsControls.left, keys: ['ArrowLeft', 'KeyA'] },
            { name: KeyboardsControls.right, keys: ['ArrowRight', 'KeyD'] },
        ],
        []
    )

    return (
        <Stack height="100vh">
            <KeyboardControls map={map}>
                <View3D
                    config={{
                        showPredictions: true,
                    }}
                    ego={{
                        position: new Vector2(-2, -2),
                        velocity: new Vector2(-1, 0),
                        id: 0,
                    }}
                    objects={[]}
                />
            </KeyboardControls>
            <PlaybackControl
                value={currentSimulationStep}
                onTogglePlayback={() => {}}
                speed={1}
                onSpeedChange={() => {}}
                isPlaying
                total={props.values.length}
            />
        </Stack>
    )
}
