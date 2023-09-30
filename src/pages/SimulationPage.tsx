import { AppBar, Stack } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { View3D } from '../components/3d/View3D'
import { ObjectDataWithPrediction, Prediction } from './DatasetSelectionPage'
import { PlaybackControl } from '../components/PlaybackControl'
import SpeedIcon from '@mui/icons-material/Speed'
import { Vector2 } from 'three'
import classnames from 'classnames'

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
        position: Vector2
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

function ScenarioTypeIndicator({ children, active }: { children: ReactNode; active: boolean }) {
    return (
        <div
            className={classnames(
                'w-full py-4 text-center border-2 border-gray-800 text-gray-700 tracking-wider font-bold rounded-lg',
                active && 'text-orange-800 border-orange-800 bg-amber-700/10'
            )}
        >
            {children}
        </div>
    )
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

    return (
        <Stack height="100vh" width="100vw" className="bg-[#262628]">
            <AppBar position="static" elevation={0}>
                <div className="flex items-center justify-between h-16 px-4 bg-gray-900 border-gray-800 border-b">
                    <img src="/logo.png" alt="logo" className="h-8" />
                </div>
            </AppBar>
            <Stack height="100%" flexGrow={1} direction="row">
                <Stack height="100%" width="100%">
                    <View3D
                        config={{
                            showPredictions: true,
                        }}
                        isPlaying={isPlaying}
                        ego={currentSimulationStepData.ego}
                        objects={currentSimulationStepData.objects}
                    />
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
                <Stack width={400} className="p-8 bg-gray-950 items-center flex-shrink-0">
                    <Stack className="items-center">
                        <SpeedIcon className="text-white" />
                        <h1 className="text-4xl font-bold text-white ">{(currentSimulationStepData.ego.speed * 3.6).toFixed(0)} km/h</h1>
                        <small className="uppercase text-xs mt-1 text-white">speed</small>
                    </Stack>

                    <Stack className="items-center mt-8 w-full gap-4">
                        {Object.keys(ScenarioType).map((type) => (
                            <ScenarioTypeIndicator active={currentSimulationStepData.scenarioType === type}>{type}</ScenarioTypeIndicator>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
