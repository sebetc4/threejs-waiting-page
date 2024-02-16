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

    // Pour une particule à x=0 f=0, x=0.5 f=0.75 , x=1 f=0.5
    // 0.5 correspond au rayon de la sphère
    float circularStrength = 1.0 - smoothstep(0.5, 1.0, abs(pos.x - radius));

    // define new angle ( * randomed speed )
    float angle = atan(pos.y, pos.x) - random.y * mix(0.5 , 1.0, circularStrength) *  0.1;
    
    // Calcul du nouveau rayon pour éviter que les particules s'effondrent sur elles-mêmes (angle * number ajoute l'effet d'étoile) 
    float targetRadius = mix(random.x, 3.0, 0.5 + 0.45 * sin(angle * 2.0 + 1.2));

    // Corrige le rayon (plus la force est grande et plus la correction est importante ce qui créé une accelleration dans les goulots d'étranglement)
    radius += (targetRadius - radius) * mix(0.2, 0.5, circularStrength);

    // targetPos use the new angle
    vec3 targetPos = vec3(cos(angle), sin(angle), 0.0) * radius;

    // move to target ( * speed)
    pos.xy += (targetPos.xy - pos.xy) * 0.1;

    pos.xy += curl(pos.xyz * 4.0, uTime * 0.001, 0.1).xy * 0.004;

    gl_FragColor = pos;
}