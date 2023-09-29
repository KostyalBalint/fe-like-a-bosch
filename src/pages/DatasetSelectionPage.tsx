import { Button, Stack, Typography } from '@mui/material'
import { Vector2 } from 'three'
import { SimulationEngine } from '../simulation/SimulationEngine'
import { CollisionAvoidanceSimulation } from '../simulation/collision-avoidance/CollisionAvoidanceSimulation'
import React from 'react'
import { parseCSV } from '../utils/parseCSV'
import { SimulationResult } from './SimulationPage'

export interface CSVData {
    timestamp: number
    vehicleSpeed: number
    yawRate: number
    objects: ObjectData[]
}

export interface ObjectData {
    id: number
    position: Vector2
    velocity: Vector2
}

export interface Prediction {
    timestamp: number
    position: Vector2
}

export interface ObjectDataWithPrediction extends ObjectData {
    predictions: Prediction[]
}

function DatasetButton({ children, onClick }: { onClick: () => Promise<void>; children: React.ReactNode }) {
    return (
        <button className="rounded-lg w-full px-24 py-8 text-white relative bg-gradient-to-r from-blue-600 to-pink-500" onClick={onClick}>
            <div className="absolute inset-0.5 bg-black flex items-center justify-center rounded-md hover:bg-transparent transition">{children}</div>
        </button>
    )
}

type RawDataRow = {
    FirstObjectDistance_X: string
    FirstObjectDistance_Y: string
    FirstObjectSpeed_X: string
    FirstObjectSpeed_Y: string

    SecondObjectDistance_X: string
    SecondObjectDistance_Y: string
    SecondObjectSpeed_X: string
    SecondObjectSpeed_Y: string

    ThirdObjectDistance_X: string
    ThirdObjectDistance_Y: string
    ThirdObjectSpeed_X: string
    ThirdObjectSpeed_Y: string

    FourthObjectDistance_X: string
    FourthObjectDistance_Y: string
    FourthObjectSpeed_X: string
    FourthObjectSpeed_Y: string

    Timestamp: string
    VehicleSpeed: string
    YawRate: string
}

export const DatasetSelectionPage = ({ onSelect }: { onSelect(results: SimulationResult[]): void }) => {
    async function handleSelect(name: string) {
        const response = await fetch(name)
        const data = await response.text()
        const csv: RawDataRow[] = parseCSV(data)
        const convertedData = csv.map((row): CSVData => {
            return {
                vehicleSpeed: Number(row.VehicleSpeed) / 256,
                yawRate: Number(row.YawRate),
                objects: [
                    {
                        id: 0,
                        position: new Vector2(Number(row.FirstObjectDistance_X) / 128, Number(row.FirstObjectDistance_Y) / 128),
                        velocity: new Vector2(Number(row.FirstObjectSpeed_X) / 256, Number(row.FirstObjectSpeed_Y) / 256),
                    },
                    {
                        id: 1,
                        position: new Vector2(Number(row.SecondObjectDistance_X) / 128, Number(row.SecondObjectDistance_Y) / 128),
                        velocity: new Vector2(Number(row.SecondObjectSpeed_X) / 256, Number(row.SecondObjectSpeed_Y) / 256),
                    },
                    {
                        id: 2,
                        position: new Vector2(Number(row.ThirdObjectDistance_X) / 128, Number(row.ThirdObjectDistance_Y) / 128),
                        velocity: new Vector2(Number(row.ThirdObjectSpeed_X) / 256, Number(row.ThirdObjectSpeed_Y) / 256),
                    },
                    {
                        id: 3,
                        position: new Vector2(Number(row.FourthObjectDistance_X) / 128, Number(row.FourthObjectDistance_Y) / 128),
                        velocity: new Vector2(Number(row.FourthObjectSpeed_X) / 256, Number(row.FourthObjectSpeed_Y) / 256),
                    },
                ],
                timestamp: Number(row.Timestamp),
            }
        })
        const simulation = new SimulationEngine(new CollisionAvoidanceSimulation())
        const result = simulation.run(convertedData)
        console.log(result)
        onSelect(result)
    }

    return (
        <div className="w-screen h-screen bg-black flex items-center p-16 gap-24">
            <div className="rounded-2xl shadow-2xl h-full relative group z-0">
                <div className="absolute inset-2 group-hover:inset-1 bg-gradient-to-r from-blue-600 to-pink-500 blur-lg -z-10" />
                <img
                    className="h-full w-full object-cover rounded-2xl"
                    src="https://s3files.core77.com/blog/images/lead_n_spotlight/409890_title__47195_83vwKms7e.jpg"
                    alt=""
                />
            </div>

            <div className="flex flex-col w-1/2 flex-shrink-0 h-full gap-8">
                <div className="flex flex-col gap-4">
                    <img className="h-16 mr-auto object-contain" src="/logo.png" />
                    <div>
                        <h1 className="text-6xl font-bold text-white inline">
                            Welcome to{' '}
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 inline">
                                CrashCraft!
                            </span>
                        </h1>
                    </div>
                    <p className="text-white text-lg">Start by selecting a dataset for the simulation.</p>
                </div>

                <div className="flex flex-col gap-4 max-w-md w-full">
                    <span className="uppercase font-bold text-white">Use existing</span>
                    <DatasetButton onClick={() => handleSelect('dataset.csv')}>dataset.csv</DatasetButton>
                </div>

                <div className="flex flex-col max-w-md w-full gap-8">
                    <span className="uppercase font-bold text-white">Use existing</span>
                    <button className="rounded-lg w-fulltext-white relative z-10 flex group">
                        <div className="absolute inset-2 group-hover:inset-1 bg-gradient-to-r from-blue-600 to-pink-500 blur-xl -z-10" />
                        <div className="bg-black px-24 py-8 w-full h-full rounded-2xl">Upload your own</div>
                    </button>
                </div>
            </div>
        </div>
    )
}
