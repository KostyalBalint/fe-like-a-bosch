import { Simulation } from '../SimulationEngine'
import { AvoidanceCalculator } from './AvoidanceCalculator'
import { CollisionDetector } from './CollisionDetector'
import { PredictionEngine } from './PredictionEngine'
import { ObjectFilter } from './ObjectFilter'
import { Vector2 } from 'three'
import { ScenarioRecognizer } from './ScenarioRecognizer'
import { CSVData, Prediction, SimulationResult } from '../../pages/dataset-selection/types'

export interface EgoData {
    position: Vector2
    speed: number
    heading: number
    predictions: Prediction[]
    yawRate: number
    velocity: Vector2
}

export class CollisionAvoidanceSimulation implements Simulation {
    private dataset: CSVData[] = []
    private filter: ObjectFilter
    private predictionEngine: PredictionEngine
    private collisionDetector: CollisionDetector
    private avoidanceCalculator: AvoidanceCalculator

    private scenarioRecognizer: ScenarioRecognizer
    private heading = 0
    private egoLocation = new Vector2(0, 0)

    constructor() {
        this.filter = new ObjectFilter()
        this.predictionEngine = new PredictionEngine()
        this.collisionDetector = new CollisionDetector()
        this.avoidanceCalculator = new AvoidanceCalculator()
        this.scenarioRecognizer = new ScenarioRecognizer()
    }

    runSimulationStep(step: number): SimulationResult {
        // 1. Filter objects
        const filteredObjects = this.filter.filterObjects(this.dataset[step].objects)

        // 2. calculate the location of the vehicle based on the speed and heading
        const dt = step === 0 ? 0 : this.dataset[step].timestamp - this.dataset[step - 1].timestamp
        this.heading -= this.dataset[step].yawRate * dt
        this.egoLocation.x += this.dataset[step].vehicleSpeed * Math.cos(this.heading) * dt
        this.egoLocation.y += this.dataset[step].vehicleSpeed * Math.sin(this.heading) * dt

        const egoVelocity = new Vector2(
            this.dataset[step].vehicleSpeed * Math.cos(this.heading),
            this.dataset[step].vehicleSpeed * Math.sin(this.heading)
        )

        // 3. Predict objects
        const objectsWithPredictions = this.predictionEngine.predictAll(filteredObjects, this.dataset[step].timestamp)
        const egoPrediction = this.predictionEngine.predictAll(
            [
                {
                    velocity: egoVelocity,
                    position: this.egoLocation.clone(),
                    id: 10,
                },
            ],
            this.dataset[step].timestamp
        )[0]

        egoPrediction.predictions = egoPrediction.predictions.map((p) => ({
            position: new Vector2(p.position.x - this.egoLocation.x, p.position.y - this.egoLocation.y),
            timestamp: p.timestamp,
        }))

        const ego: EgoData = {
            position: this.egoLocation.clone(),
            speed: this.dataset[step].vehicleSpeed,
            velocity: egoVelocity,

            heading: this.heading,
            predictions: egoPrediction.predictions,
            yawRate: this.dataset[step].yawRate,
        }

        // 4. Recognize scenario
        const collidingObject = this.collisionDetector.findCollision(egoPrediction, objectsWithPredictions, this.dataset[step].timestamp)
        let scenarioType = null
        if (collidingObject) {
            scenarioType = this.scenarioRecognizer.recognizeScenario(ego, collidingObject)
        }

        // 5. Calculate avoidance data
        const avoidanceData = this.avoidanceCalculator.calculateAvoidanceData(egoPrediction, collidingObject)

        return {
            timestamp: this.dataset[step].timestamp,
            ego,
            collidingObject,
            objects: objectsWithPredictions,
            avoidanceData: avoidanceData,
            scenarioType,
        }
    }

    setDataset(dataset: CSVData[]): void {
        this.dataset = dataset
    }
}
