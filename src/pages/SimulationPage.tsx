import { AppBar, Stack } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { View3D } from '../components/3d/View3D'
import { ObjectDataWithPrediction, Prediction } from './DatasetSelectionPage'
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
    ego: {
        speed: number
        heading: number
        yawRate: number
        predictions: Prediction[]
    }
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
    const [isPlaying, setIsPlaying] = useState(true)
    const [speed, setSpeed] = useState(1)

    const currentSimulationStepData = props.values[currentSimulationStep]

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPlaying) return
            setCurrentSimulationStep((step) => (step + 1) % props.values.length)
        }, 100 / speed)
        return () => {
            clearInterval(interval)
        }
    }, [props.values.length, isPlaying, speed])

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
        <Stack height="100vh" className="bg-[#262628]">
            <AppBar position="static" elevation={0}>
                <div className="flex items-center justify-between h-16 px-4 bg-gray-900 border-gray-800 border-b">
                    <img src="/logo.png" alt="logo" className="h-8" />
                </div>
            </AppBar>
            <KeyboardControls map={map}>
                <View3D
                    config={{
                        showPredictions: true,
                    }}
                    isPlaying={isPlaying}
                    ego={currentSimulationStepData.ego}
                    objects={currentSimulationStepData.objects}
                />
            </KeyboardControls>
            <PlaybackControl
                timestamp={currentSimulationStepData.timestamp - props.values[0].timestamp}
                value={currentSimulationStep}
                onTogglePlayback={() => setIsPlaying((isPlaying) => !isPlaying)}
                onChange={(value) => setCurrentSimulationStep(value)}
                speed={speed}
                onSpeedChange={setSpeed}
                isPlaying={isPlaying}
                total={props.values.length}
            />
        </Stack>
    )
}
