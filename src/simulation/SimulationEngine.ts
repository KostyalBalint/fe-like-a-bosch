import { CSVData } from '../pages/DatasetSelectionPage'
import { SimulationResult } from '../pages/SimulationPage'

export interface Simulation {
    setDataset(dataset: CSVData[]): void
    runSimulationStep(step: number): SimulationResult
}

export class SimulationEngine {
    constructor(private readonly simulation: Simulation) {}

    run(dataset: CSVData[]): SimulationResult[] {
        this.simulation.setDataset(dataset)
        return dataset.map((data, index) => {
            return this.simulation.runSimulationStep(index)
        })
    }
}
