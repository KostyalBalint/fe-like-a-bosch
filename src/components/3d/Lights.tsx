import React from 'react'

export function Lights() {
    return (
        <>
            <ambientLight intensity={2} color={'white'} />
            <pointLight shadow-mapSize-width={4096} shadow-mapSize-height={4096} position={[0, 10, 0]} intensity={300} castShadow />

            <pointLight position={[10, 0, 10]} intensity={50} />
            <pointLight position={[-10, 0, 10]} intensity={50} />
            <pointLight position={[10, 0, -10]} intensity={50} />
            <pointLight position={[-10, 0, -10]} intensity={50} />
        </>
    )
}
