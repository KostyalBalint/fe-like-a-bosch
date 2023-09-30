import React from 'react'
import { Environment } from '@react-three/drei'

export function Lights() {
    return (
        <>
            <Environment files={'assets/quattro_canti_1k.hdr'}>
                <ambientLight intensity={1} />
            </Environment>
        </>
        //<pointLight position={[0, 10, 0]} intensity={300} />
    )
}
