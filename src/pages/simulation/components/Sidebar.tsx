import { Signal, SimulationResult } from '../../dataset-selection/types'
import { LinearProgress, Stack } from '@mui/material'
import { HornIcon } from './HornIcon'
import SpeedIcon from '@mui/icons-material/Speed'
import { HeadlightIcon } from './HeadlightIcon'
import { ScenarioTypes } from './ScenarioTypes'
import { ObjectInfo } from './ObjectInfo'
import React from 'react'

export function Sidebar({ currentSimulationStepData }: { currentSimulationStepData: SimulationResult }) {
    return (
        <Stack width={400} className="p-8 bg-gray-950 items-center flex-shrink-0">
            <Stack direction="row" className="items-center justify-between w-full">
                <HornIcon active={currentSimulationStepData.avoidanceData.signal === Signal.HORN} />
                <Stack className="items-center">
                    <SpeedIcon className="text-white" />
                    <h1 className="text-4xl font-bold text-white ">{(currentSimulationStepData.ego.speed * 3.6).toFixed(0)} km/h</h1>
                    <small className="uppercase text-xs mt-1 text-white">speed</small>
                </Stack>
                <HeadlightIcon active={currentSimulationStepData.avoidanceData.signal === Signal.HEADLIGHT_FLASH} />
            </Stack>
            <div className="w-full mt-5">
                <LinearProgress variant="determinate" value={(currentSimulationStepData.avoidanceData.decelerationNeeded * 100) / 9} />
            </div>
            <span className="text-white text-xs font-bold tracking-wider uppercase mt-2">Deceleration Needed</span>
            <ScenarioTypes value={currentSimulationStepData.scenarioType} />
            <ObjectInfo objects={currentSimulationStepData.objects} />
        </Stack>
    )
}
