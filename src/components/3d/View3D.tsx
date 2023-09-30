import React, { ReactElement } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, Vector2 } from 'three'
import { IntersectedObject } from '../../simulation/collision-avoidance/CollisionDetector'
import { AvoidanceData, ObjectDataWithPrediction, Prediction } from '../../pages/dataset-selection/types'
import { SimulationScene } from './SimulationScene'

export interface View3DConfig {
    showPredictions: boolean
    showBrakeDistance: boolean
    showIntersections: boolean
}

export interface View3DProps {
    ego: {
        position: Vector2
        speed: number
        heading: number
        yawRate: number
        predictions: Prediction[]
    }
    avoidanceData: AvoidanceData
    collidingObject: IntersectedObject | null
    objects: ObjectDataWithPrediction[]
    config: View3DConfig
    isPlaying: boolean
}

export function View3D(props: View3DProps): ReactElement {
    return (
        <div className="h-full relative">
            <Canvas
                style={{ height: '100%', width: '100%' }}
                gl={{
                    antialias: true,
                    toneMapping: ACESFilmicToneMapping,
                    pixelRatio: window.devicePixelRatio,
                }}
            >
                <SimulationScene {...props} />
            </Canvas>
            <div className="absolute bottom-3 left-3 w-[30vw] aspect-video rounded-lg overflow-hidden shadow-xl bg-gray-900/70">
                <Canvas
                    style={{ height: '100%', width: '100%' }}
                    gl={{
                        antialias: true,
                        outputColorSpace: 'srgb',
                        toneMapping: ACESFilmicToneMapping,
                        toneMappingExposure: 0.8,
                        pixelRatio: window.devicePixelRatio,
                    }}
                >
                    <SimulationScene {...props} isTopDownView />
                </Canvas>
            </div>
        </div>
    )
}
