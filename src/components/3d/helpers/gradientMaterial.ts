import { Color, ShaderMaterial } from 'three'

export const createGradientMaterial = (color: Color, toOpacity = 0.3) => {
    return new ShaderMaterial({
        uniforms: {
            color1: {
                value: color,
            },
            opacity1: {
                value: 1,
            },
            color2: {
                value: color,
            },
            opacity2: {
                value: toOpacity,
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
}
