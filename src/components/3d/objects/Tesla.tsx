import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Color, MeshPhongMaterial, MeshPhysicalMaterial } from 'three'
import { useFrame } from '@react-three/fiber'

interface TeslaProps {
    speed?: number
    yawRate?: number
    isPlaying?: boolean
}

export function Tesla(props: TeslaProps) {
    // @ts-ignore
    const { nodes, materials } = useGLTF('/assets/tesla.glb')

    const bodyMaterial = new MeshPhysicalMaterial({
        color: new Color('#ececec'),
        metalness: 1.0,
        roughness: 0.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.5,
        reflectivity: 1.0,
        envMapIntensity: 1.0,
    })

    const wheel_fl = useRef<any>()
    const wheel_fr = useRef<any>()
    const wheel_rl = useRef<any>()
    const wheel_rr = useRef<any>()

    const wheelDirPositive = [wheel_fr, wheel_rl, wheel_rr]
    const wheelDirNegative = [wheel_fl]

    const yawRate = props.yawRate || 0
    const speed = props.speed || 0
    const wheelRadius = 0.09

    useFrame((state, delta, frame) => {
        if (!props.isPlaying) return
        wheelDirPositive.forEach((wheel) => {
            wheel.current.rotation.x += delta * speed * Math.PI * 2 * wheelRadius
        })
        wheelDirNegative.forEach((wheel) => {
            wheel.current.rotation.x -= delta * speed * Math.PI * 2 * wheelRadius
        })
    })

    return (
        <group {...props} dispose={null}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={0.016}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                    <group ref={wheel_rl} position={[94.056, 24.626, -179.132]} rotation={[-Math.PI / 2, 0, 0]} scale={1.222}>
                        <mesh geometry={nodes.wheel003_Material007_0.geometry} material={materials['Material.007']} />
                        <mesh geometry={nodes.wheel003_Material006_0.geometry} material={materials['Material.006']} />
                        <mesh geometry={nodes.wheel003_Rims_0.geometry} material={materials.Rims} />
                    </group>
                    <group ref={wheel_rr} position={[-94.056, 24.626, -179.132]} rotation={[-Math.PI / 2, 0, -Math.PI]} scale={1.222}>
                        <mesh geometry={nodes.wheel002_Material007_0.geometry} material={materials['Material.007']} />
                        <mesh geometry={nodes.wheel002_Material006_0.geometry} material={materials['Material.006']} />
                        <mesh geometry={nodes.wheel002_Rims_0.geometry} material={materials.Rims} />
                    </group>
                    <group position={[-94.056, 24.626, 153.981]} rotation={[-Math.PI / 2, 0, -yawRate - Math.PI]} scale={1.222}>
                        <group ref={wheel_fl}>
                            <mesh geometry={nodes.wheel001_Material007_0.geometry} material={materials['Material.007']} />
                            <mesh geometry={nodes.wheel001_Material006_0.geometry} material={materials['Material.006']} />
                            <mesh geometry={nodes.wheel001_Rims_0.geometry} material={materials.Rims} />
                        </group>
                    </group>
                    <group position={[94.056, 24.626, 153.981]} rotation={[-Math.PI / 2, 0, -yawRate]} scale={1.222}>
                        <group ref={wheel_fr}>
                            <mesh geometry={nodes.wheel_Material007_0.geometry} material={materials['Material.007']} />
                            <mesh geometry={nodes.wheel_Material006_0.geometry} material={materials['Material.006']} />
                            <mesh geometry={nodes.wheel_Rims_0.geometry} material={materials.Rims} />
                        </group>
                    </group>
                    <mesh geometry={nodes.object_emit_0.geometry} material={materials.emit} scale={0.103} />
                    <mesh geometry={nodes.object001_int_0.geometry} material={materials.material} scale={0.103} />
                    <mesh geometry={nodes.object002_red_0.geometry} material={materials.material_6} scale={0.103} />
                    <mesh geometry={nodes.object003_Material004_0.geometry} material={materials['Material.004']} scale={0.103} />
                    <mesh geometry={nodes.object004_glack_0.geometry} material={materials.glack} scale={0.103} />
                    <mesh geometry={nodes.object005_bod_0.geometry} material={bodyMaterial} scale={0.103} />
                    <mesh geometry={nodes.object006_chr_0.geometry} material={materials.material_10} scale={0.103} />
                    <mesh geometry={nodes.object007_flack_0.geometry} material={materials.flack} scale={0.103} />
                    <mesh geometry={nodes.object008_Material002_0.geometry} material={materials['Material.002']} scale={0.103} />
                    <mesh geometry={nodes.object009_Material005_0.geometry} material={materials['Material.005']} scale={0.103} />
                    <mesh geometry={nodes.object010_glass_0.geometry} material={materials.glass} scale={0.103} />
                    <mesh geometry={nodes.object012_Material001_0.geometry} material={materials['Material.001']} scale={0.103} />
                    <mesh geometry={nodes.object013_grill_0.geometry} material={materials.grill} scale={0.103} />
                    <mesh geometry={nodes.object014_Material003_0.geometry} material={materials['Material.003']} scale={0.103} />
                    <mesh geometry={nodes.object015_rev_0.geometry} material={materials.material_18} scale={0.103} />
                    <mesh geometry={nodes.object016_refl_0.geometry} material={materials.refl} scale={0.103} />
                </group>
            </group>
        </group>
    )
}

useGLTF.preload('/assets/tesla.glb')
