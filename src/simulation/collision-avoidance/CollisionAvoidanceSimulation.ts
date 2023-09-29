import { Simulation } from '../SimulationEngine'
import { SimulationResult } from '../../pages/SimulationPage'
import { CSVData } from '../../pages/DatasetSelectionPage'
import { AvoidanceCalculator } from './AvoidanceCalculator'
import { ScenarioRecognizer } from './ScenarioRecognizer'
import { PredictionEngine } from './PredictionEngine'
import { ObjectFilter } from './ObjectFilter'
import { Vector2 } from 'three'

export class CollisionAvoidanceSimulation implements Simulation {
    private dataset: CSVData[] = []
    private filter: ObjectFilter
    private predictionEngine: PredictionEngine
    private scenarioRecognizer: ScenarioRecognizer
    private avoidanceCalculator: AvoidanceCalculator
    private heading = 0

    constructor() {
        this.filter = new ObjectFilter()
        this.predictionEngine = new PredictionEngine()
        this.scenarioRecognizer = new ScenarioRecognizer()
        this.avoidanceCalculator = new AvoidanceCalculator()
    }

    runSimulationStep(step: number): SimulationResult {
        // 1. Filter objects
        const filteredObjects = this.filter.filterObjects(this.dataset[step].objects)

        // 2. Predict objects
        const objectsWithPredictions = this.predictionEngine.predictAll(filteredObjects)

        // 3. Recognize scenario
        const scenarioType = this.scenarioRecognizer.recognizeScenario(objectsWithPredictions)

        // 4. Calculate avoidance data
        const avoidanceData = this.avoidanceCalculator.calculateAvoidanceData(objectsWithPredictions, scenarioType)

        const dt = step === 0 ? 0 : this.dataset[step].timestamp - this.dataset[step - 1].timestamp
        this.heading -= this.dataset[step].yawRate * dt

        return {
            timestamp: this.dataset[step].timestamp,
            ego: {
                speed: this.dataset[step].vehicleSpeed,
                heading: this.heading,
            },
            objects: objectsWithPredictions,
            avoidanceData,
            scenarioType,
        }
    }

    setDataset(dataset: CSVData[]): void {
        this.dataset = dataset
    }
}
