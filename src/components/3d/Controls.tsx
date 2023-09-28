import React from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Vector3 } from 'three'

interface ControlsProps {
    cameraLookAt: Vector3
}

export function Controls(props: ControlsProps): React.ReactElement {
    return (
        <>
            <PerspectiveCamera far={100} position={props.cameraLookAt.add(new Vector3(0, 2, 0))} makeDefault />
            <OrbitControls enableDamping={true} maxPolarAngle={(80 / 180) * Math.PI} minDistance={5} maxDistance={40} />
        </>
    )
}
