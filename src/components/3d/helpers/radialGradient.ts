import { Color, ShaderMaterial } from 'three'

export const radialGradientMaterial = new ShaderMaterial({
    uniforms: {
        color1: {
            value: new Color('#606060'),
        },
        opacity1: {
            value: 0.4,
        },
        color2: {
            value: new Color('black'),
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
            
            float dist(vec2 p0, vec2 pf){return sqrt((pf.x-p0.x)*(pf.x-p0.x)+(pf.y-p0.y)*(pf.y-p0.y));}
            
            void main() {
                float d = dist(vec2(0.5, 0.5), vUv);
                float alpha = smoothstep(opacity1, opacity2, clamp(d * 2.0, 0.0, 1.0));
                
                gl_FragColor = vec4(mix(color1, color2, d), alpha );
            }
          `,
    transparent: true,
})
