import { Color, DoubleSide, ShaderMaterial, Vector3 } from 'three'

export const volumetricSpotlightMaterial = (config: { attenuation: number; anglePower: number; spotPosition: Vector3; lightColor: Color }) => {
    //
    const vertexShader = [
        'varying vec3 vNormal;',
        'varying vec3 vWorldPosition;',

        'void main(){',
        '// compute intensity',
        'vNormal		= normalize( normalMatrix * normal );',

        'vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );',
        'vWorldPosition		= worldPosition.xyz;',

        '// set gl_Position',
        'gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}',
    ].join('\n')
    const fragmentShader = [
        'varying vec3		vNormal;',
        'varying vec3		vWorldPosition;',

        'uniform vec3		lightColor;',

        'uniform vec3		spotPosition;',

        'uniform float		attenuation;',
        'uniform float		anglePower;',

        'void main(){',
        'float intensity;',

        //////////////////////////////////////////////////////////
        // distance attenuation					//
        //////////////////////////////////////////////////////////
        'intensity	= abs(distance(vWorldPosition, spotPosition)/attenuation);',
        'intensity	= 1.0 - clamp(intensity, 0.0, 1.0);',

        //////////////////////////////////////////////////////////
        // intensity on angle					//
        //////////////////////////////////////////////////////////
        'vec3 normal	= normalize(vNormal);',
        'float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );',

        'intensity	= intensity * angleIntensity;',
        // 'gl_FragColor	= vec4( lightColor, intensity );',

        //////////////////////////////////////////////////////////
        // final color						//
        //////////////////////////////////////////////////////////

        // set the final color
        'gl_FragColor	= vec4( lightColor, intensity);',
        '}',
    ].join('\n')

    // create custom material from the shader code above
    //   that is within specially labeled script tags
    return new ShaderMaterial({
        uniforms: {
            attenuation: {
                // @ts-ignore
                type: 'f',
                value: config.attenuation,
            },
            anglePower: {
                // @ts-ignore
                type: 'f',
                value: config.anglePower,
            },
            spotPosition: {
                // @ts-ignore
                type: 'v3',
                value: config.spotPosition,
            },
            lightColor: {
                // @ts-ignore
                type: 'c',
                value: config.lightColor,
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // side		: DoubleSide,
        // blending	: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
    })
}
