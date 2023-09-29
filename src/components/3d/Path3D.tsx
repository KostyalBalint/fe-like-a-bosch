import { CatmullRomCurve3, Color, ShaderMaterial, TubeGeometry, Vector2, Vector3 } from 'three'

interface Path3DParams {
    path: Vector2[]
    pathHeight: number
    closed?: boolean
    radius?: number
}

export const Path3D = (props: Path3DParams) => {
    const curve = new CatmullRomCurve3(
        props.path.map((p) => new Vector3(p.x, props.pathHeight, p.y)),
        false
    )

    const material = new ShaderMaterial({
        uniforms: {
            color1: {
                value: new Color('#a9c5fd'),
            },
            opacity1: {
                value: 1,
            },
            color2: {
                value: new Color('#a9c5fd'),
            },
            opacity2: {
                value: 0.3,
            },
        },
        vertexShader: `
            varying vec2 vUv;
        
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float opacity1;
            uniform float opacity2;
          
            varying vec2 vUv;
            
            void main() {
                //gl_FragColor = vec4(mix(color1, color2, vUv.x), mix(opacity1, opacity2, vUv.x));
                
                // y < 0 = transparent, > 1 = opaque
                float alpha = smoothstep(opacity1, opacity2, vUv.x);
            
                // y < 1 = color1, > 2 = color2
                float colorMix = smoothstep(0.0, 1.0, vUv.x);
            
                gl_FragColor = vec4(mix(color1, color2, colorMix), alpha);
            }
          `,
        transparent: true,
    })

    //const geometry = new BufferGeometry().setFromPoints(points)
    const tubeGeometry = new TubeGeometry(curve, 100, props.radius, 10, props.closed)
    tubeGeometry.scale(1, 0.05, 1)
    return (
        <mesh>
            <primitive object={tubeGeometry} attach="geometry" />
            <primitive object={material} attach="material" />
        </mesh>
    )
}
