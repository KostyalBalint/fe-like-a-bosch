import { SimulationPageProps } from '../../dataset-selection/types'
import { useEffect, useState } from 'react'

export function usePlayer(props: SimulationPageProps) {
    const [currentSimulationStep, setCurrentSimulationStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [speed, setSpeed] = useState(1)

    const currentSimulationStepData = props.values[currentSimulationStep]

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPlaying) return
            setCurrentSimulationStep((step) => (step + 1) % props.values.length)
        }, 100 / speed)
        return () => {
            clearInterval(interval)
        }
    }, [props.values.length, isPlaying, speed])
    return { currentSimulationStep, setCurrentSimulationStep, isPlaying, setIsPlaying, speed, setSpeed, currentSimulationStepData }
}
