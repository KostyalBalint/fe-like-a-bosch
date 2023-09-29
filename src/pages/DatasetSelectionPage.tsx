import { Button, Stack } from '@mui/material'
import { parseCSV } from '../utils/parseCSV'
import { Vector2 } from 'three'
import { SimulationEngine } from '../simulation/SimulationEngine'
import { CollisionAvoidanceSimulation } from '../simulation/collision-avoidance/CollisionAvoidanceSimulation'
import { SimulationResult } from './SimulationPage'

export interface CSVData {
    timestamp: number
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

export const DatasetSelectionPage = ({ onSelect }: { onSelect(results: SimulationResult[]): void }) => {
    async function handleSelect(name: string) {
        //const csv = parseCSV('a,b,c\n1,2,3')
        const csv: CSVData[] = [{ timestamp: 0, objects: [] }]
        const simulation = new SimulationEngine(new CollisionAvoidanceSimulation())
        const result = simulation.run(csv)
        onSelect(result)
    }

    return (
        <Stack>
            <Button onClick={() => handleSelect('dataset1.csv')}>Dataset1.csv</Button>
            <Button onClick={() => handleSelect('dataset2.csv')}>Dataset2.csv</Button>
            <Button onClick={() => handleSelect('dataset3.csv')}>Dataset3.csv</Button>
        </Stack>
    )
}
