#include "curl.glsl"
uniform sampler2D uPositions;
uniform sampler2D uRandoms;
uniform float uTime;
uniform float uDeltaTime;
varying vec2 vUv;

void main() {

    vec4 pos = texture2D(uPositions, vUv);
    vec4 random = texture2D(uRandoms, vUv);

    float radius = length(pos.xy);

    float circularStrength = 1.0 - smoothstep(0.5, 1.0, abs(pos.x - radius));

    float angle = atan(pos.y, pos.x) - random.y * mix(0.5 , 1.0, circularStrength) *  0.1;
    
    float targetRadius = mix(random.x, 3.0, 0.5 + 0.45 * sin(angle * 2.0 + 1.2));

    radius += (targetRadius - radius) * mix(0.2, 0.5, circularStrength);

    vec3 targetPos = vec3(cos(angle), sin(angle), 0.0) * radius;

    pos.xy += (targetPos.xy - pos.xy) * 0.1;

    pos.xy += curl(pos.xyz * 4.0, uTime * 0.001, 0.1).xy * 0.004;

    gl_FragColor = pos;
}