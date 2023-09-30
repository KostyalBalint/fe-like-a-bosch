import { ACESFilmicToneMapping } from 'three'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import { Lights } from './Lights'
import { Tesla } from './objects/Tesla'
import { OrbitControls } from '@react-three/drei'

export const CarShowRoom = () => {
    const polarAngle = (60 / 180) * Math.PI
    return (
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
            <scene>
                <Lights />
                <Tesla />

                <OrbitControls
                    autoRotate
                    autoRotateSpeed={1}
                    maxPolarAngle={polarAngle}
                    minPolarAngle={polarAngle}
                    minDistance={10}
                    maxDistance={10}
                />
            </scene>
        </Canvas>
    )
}
