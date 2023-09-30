import { ObjectDataWithPrediction } from '../../dataset-selection/types'
import { useSelectedObject } from '../../../context/SelectedObjectContext'
import { Stack } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import React from 'react'

export function ObjectInfo({ objects }: { objects: ObjectDataWithPrediction[] }) {
    const { setSelectedObject, selectedObject } = useSelectedObject()

    return (
        <Stack className="items-center mt-8 w-full gap-4">
            <small className="text-gray-300 font-bold text-sm tracking-wider uppercase mr-auto">Object Info</small>
            {objects.map((object) => {
                return (
                    <div
                        key={object.id}
                        onClick={() => setSelectedObject(object.id)}
                        className={`${
                            selectedObject === object.id ? 'border-blue-900' : 'border-gray-900'
                        } 'bg-gray-900 border-2 w-full py-2 px-6 rounded-lg flex items-center gap-4`}
                    >
                        <span className="font-bold text-xl text-gray-300">#{object.id}</span>
                        <div className="flex flex-col gap-1 font-mono text-gray-400">
                            <span>ΔX: {object.position.x.toFixed(2)}m</span>
                            <span>ΔY: {object.position.y.toFixed(2)}m</span>
                        </div>
                        <div className="flex flex-col gap-1 font-mono text-gray-400 ml-auto items-center text-xs">
                            <ArrowForwardIcon style={{ transform: `rotate(${(object.velocity.angle() * 180) / Math.PI - 90}deg)` }} />
                            {(object.velocity.length() * 3.6).toFixed(1)}km/h
                        </div>
                    </div>
                )
            })}
        </Stack>
    )
}
