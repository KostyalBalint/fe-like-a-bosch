import { Vector2 } from 'three'
import { IntersectedObject } from '../../simulation/collision-avoidance/CollisionDetector'

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

export type RawDataRow = {
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

export enum ScenarioType {
    CPNCO = 'CPNCO',
    CPTA = 'CPTA',
    CPLA = 'CPLA',
}

export enum Signal {
    HORN = 'HORN',
    HEADLIGHT_FLASH = 'HEADLIGHT_FLASH',
}

export interface AvoidanceData {
    signal: Signal | null
    brakeDistance: number
    decelerationNeeded: number
}

export interface SimulationResult {
    ego: {
        position: Vector2
        speed: number
        heading: number
        yawRate: number
        predictions: Prediction[]
    }
    collidingObject: IntersectedObject | null
    objects: ObjectDataWithPrediction[]
    scenarioType: ScenarioType | null
    avoidanceData: AvoidanceData
    timestamp: number
}

export type SimulationPageProps = {
    values: SimulationResult[]
}
