import {Simulation} from "../SimulationEngine";
import {SimulationResult} from "../../pages/SimulationPage";
import {CSVData} from "../../pages/DatasetSelectionPage";
import {AvoidanceCalculator} from "./AvoidanceCalculator";
import {ScenarioRecognizer} from "./ScenarioRecognizer";
import {PredictionEngine} from "./PredictionEngine";
import {ObjectFilter} from "./ObjectFilter";

export class CollisionAvoidanceSimulation implements Simulation {
    private dataset: CSVData[] = [];
    private filter: ObjectFilter;
    private predictionEngine: PredictionEngine;
    private scenarioRecognizer: ScenarioRecognizer;
    private avoidanceCalculator: AvoidanceCalculator;

    constructor() {
        this.filter = new ObjectFilter();
        this.predictionEngine = new PredictionEngine();
        this.scenarioRecognizer = new ScenarioRecognizer();
        this.avoidanceCalculator = new AvoidanceCalculator();
    }

    runSimulationStep(step: number): SimulationResult {
        // 1. Filter objects
        const filteredObjects = this.filter.filterObjects(this.dataset[step].objects);

        // 2. Predict objects
        const objectsWithPredictions = this.predictionEngine.predictAll(filteredObjects);
        const egoObject = this.dataset[step].objects[0];
        const egoWithPredictions = this.predictionEngine.generatePredictionsForObject(egoObject);

        // 3. Recognize scenario
        const scenarioType = this.scenarioRecognizer.recognizeScenario(egoWithPredictions, objectsWithPredictions);

        // 4. Calculate avoidance data
        const avoidanceData = this.avoidanceCalculator.calculateAvoidanceData(egoWithPredictions, objectsWithPredictions, scenarioType);

        return {
            timestamp: this.dataset[step].timestamp,
            ego: egoWithPredictions,
            objects: objectsWithPredictions,
            avoidanceData,
            scenarioType,
        }
    }

    setDataset(dataset: CSVData[]): void {
        this.dataset = dataset;
    }

}