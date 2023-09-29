import React from 'react'

export function Lights() {
    return (
        <>
            <ambientLight intensity={1} />
            <pointLight shadow-mapSize-width={4096} shadow-mapSize-height={4096} position={[0, 10, 0]} intensity={300} castShadow={false} />
        </>
    )
}
