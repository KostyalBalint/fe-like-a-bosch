import { Stack } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Vector2 } from 'three'
import { View3D } from '../components/3d/View3D'
import { ObjectDataWithPrediction } from './DatasetSelectionPage'
import { PlaybackControl } from '../components/PlaybackControl'
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei'

export enum ScenarioType {
    CPNCO = 'CPNCO',
    CPTA = 'CPTA',
    CPLA = 'CPLA',
}

export enum Signal {
    HORN = 'HORN',
    HEADLIGHT_FLASH = 'HEADLIGHT_FLASH',
}

export interface AvoidanceData {
    signal: Signal | null
    brakeDistance: number
    decelerationNeeded: number
}

export interface SimulationResult {
    ego: ObjectDataWithPrediction
    objects: ObjectDataWithPrediction[]
    scenarioType: ScenarioType | null
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

    const currentSimulationStepData = props.values[currentSimulationStep]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSimulationStep((step) => (step + 1) % props.values.length)
        }, 3000)
        return () => {
            clearInterval(interval)
        }
    }, [props.values.length])

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
                    ego={currentSimulationStepData.ego}
                    objects={currentSimulationStepData.objects}
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
