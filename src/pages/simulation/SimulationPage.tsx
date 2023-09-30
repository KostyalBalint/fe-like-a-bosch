import { Stack } from '@mui/material'
import React, { useState } from 'react'
import { View3D, View3DConfig } from '../../components/3d/View3D'
import { PlaybackControl } from '../../components/PlaybackControl'
import { SelectedObjectContextProvider } from '../../context/SelectedObjectContext'
import { SimulationPageProps } from '../dataset-selection/types'
import { Sidebar } from './components/Sidebar'
import { usePlayer } from './hooks/usePlayer'
import { Header } from './components/Header'

export const SimulationPage = (props: SimulationPageProps) => {
    const [config, setConfig] = useState<View3DConfig>({
        showPredictions: true,
        showBrakeDistance: true,
        showIntersections: true,
    })
    const { currentSimulationStep, setCurrentSimulationStep, isPlaying, setIsPlaying, speed, setSpeed, currentSimulationStepData } = usePlayer(props)

    return (
        <SelectedObjectContextProvider>
            <Stack height="100vh" width="100vw" className="bg-[#161616]">
                <Stack height="100%" flexGrow={1} direction="row">
                    <Stack height="100%" width="100%">
                        <Header config={config} onChange={setConfig} />
                        <View3D
                            config={config}
                            collidingObject={currentSimulationStepData.collidingObject}
                            isPlaying={isPlaying}
                            ego={currentSimulationStepData.ego}
                            objects={currentSimulationStepData.objects}
                            avoidanceData={currentSimulationStepData.avoidanceData}
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
                    <Sidebar currentSimulationStepData={currentSimulationStepData} />
                </Stack>
            </Stack>
        </SelectedObjectContextProvider>
    )
}
