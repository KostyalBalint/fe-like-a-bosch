import { SimulationEngine } from '../../simulation/SimulationEngine'
import { CollisionAvoidanceSimulation } from '../../simulation/collision-avoidance/CollisionAvoidanceSimulation'
import React from 'react'
import { parseCSV } from '../../utils/parseCSV'
import { CustomFileUpload } from './components/CustomFileUpload'
import { convertRow } from './utils/convertRow'
import { Title } from './components/Title'
import { ExistingDataset } from './components/ExistingDataset'
import { CSVData, RawDataRow, SimulationResult } from './types'

interface DatasetSelectionPageProps {
    onSelect(results: SimulationResult[]): void
    onEdit(): void
}

export const DatasetSelectionPage = ({ onSelect, onEdit }: DatasetSelectionPageProps) => {
    async function runSimulation(rawData: string) {
        const csv: RawDataRow[] = parseCSV(rawData)
        const convertedData = csv.map((row): CSVData => convertRow(row))
        const simulation = new SimulationEngine(new CollisionAvoidanceSimulation())
        const result = simulation.run(convertedData)
        onSelect(result)
    }

    async function handleSelect(name: string) {
        const response = await fetch(name)
        const data = await response.text()
        await runSimulation(data)
    }

    async function handleUpload(file: File) {
        const data = await file.text()
        await runSimulation(data)
    }

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center p-16 gap-24 overflow-hidden">
            <div className="flex flex-col max-w-xl w-full flex-shrink-0 justify-center items-center h-full gap-8">
                <Title />
                <ExistingDataset onClick={(name) => handleSelect(name)} />
                <CustomFileUpload onFileUpload={(file) => handleUpload(file)} />

                <button className="text-white font-sm" onClick={onEdit}>
                    Open Editor
                </button>
            </div>
        </div>
    )
}
