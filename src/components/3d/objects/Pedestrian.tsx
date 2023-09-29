import { useEffect, useState } from 'react'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { AnimationClip, AnimationMixer, Mesh, MeshPhysicalMaterial, Object3D } from 'three'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'

interface PedestrianProps {
    x: number
    y: number
    heading: number
    color?: string
    opacity?: number
    onClick?: () => void
    //TODO: MovementState NOT implemented yet
    movementState?: PedestrianMovementState
}

export enum PedestrianMovementState {
    Idle = 0,
    Walking = 6,
    Running = 3,
}

function colorPedestrian(color: string, opacity: number, modelData: Object3D) {
    const bodyMaterial = new MeshPhysicalMaterial({
        color: color,
        opacity: opacity,
        transparent: opacity < 1,
        metalness: 0.4,
        roughness: 0.8,
        clearcoat: 1.0,
    })

    const jointMaterial = new MeshPhysicalMaterial({
        color: color,
        opacity: opacity,
        transparent: opacity < 1,
        metalness: 0.8,
        reflectivity: 0.8,
        roughness: 0.0,
    })

    const betaJoints = modelData.getObjectByName('Beta_Joints')
    if (betaJoints instanceof Mesh) {
        betaJoints.material = jointMaterial
    }

    const betaSurface = modelData.getObjectByName('Beta_Surface')
    if (betaSurface instanceof Mesh) {
        betaSurface.material = bodyMaterial
    }
}

export const Pedestrian = ({ movementState = PedestrianMovementState.Idle, color = 'gray', opacity = 1, ...props }: PedestrianProps) => {
    const { scene, animations } = useGLTF('/assets/Xbot.glb', true)
    const { actions, mixer } = useAnimations(animations, scene)
    const [lastAction, setLastAction] = useState(PedestrianMovementState.Idle)

    useEffect(() => {
        if (scene) {
            colorPedestrian(color, opacity, scene)
        }
        mixer.clipAction(animations[lastAction]).play()
    }, [])

    useEffect(() => {
        mixer.clipAction(animations[lastAction]).fadeOut(0.5)
        mixer.clipAction(animations[movementState]).reset().fadeIn(0.5).play()

        setLastAction(movementState)
    }, [movementState])

    useFrame((state, delta, frame) => {
        if (mixer) mixer.update(delta / 3)
    })

    return (
        <>
            {scene && (
                <group
                    onClick={props.onClick}
                    position={[props.x, 0, props.y]}
                    rotation={[0, ((props.heading + 90) * Math.PI) / 180, 0]}
                    scale={[1, 0.5, 1]}
                >
                    <primitive object={scene} />
                </group>
            )}
        </>
    )
}
