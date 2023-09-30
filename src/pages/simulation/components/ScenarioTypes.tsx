import { ScenarioType } from '../../dataset-selection/types'
import { Stack } from '@mui/material'
import { ScenarioTypeIndicator } from './ScenarioTypeIndicator'
import React from 'react'

export function ScenarioTypes({ value }: { value: ScenarioType | null }) {
    return (
        <Stack id="scenario-types" className="items-center mt-8 w-full gap-4">
            <small className="text-gray-300 font-bold text-sm tracking-wider uppercase mr-auto">Scenario Type</small>
            {Object.keys(ScenarioType).map((type) => (
                <ScenarioTypeIndicator key={type} active={value === type}>
                    {type}
                </ScenarioTypeIndicator>
            ))}
        </Stack>
    )
}
