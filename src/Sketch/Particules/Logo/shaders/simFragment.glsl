uniform float uTime;
uniform float uLogoTextMix;
uniform sampler2D uPositions;
uniform sampler2D uLogoPositions;
uniform sampler2D uTextPositions;
uniform vec3 uPointer;
uniform float uFriction;
uniform float uMouseEffectDistance;
uniform float uMouseEffectStrength;
uniform float uAttractionStrength;

varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 position = texture2D(uPositions, vUv).xy;
    vec2 logoPosition = texture2D(uLogoPositions, vUv).xy;
    vec2 textPosition = texture2D(uTextPositions, vUv).xy;

    vec2 finalPosition = mix(logoPosition, textPosition, uLogoTextMix);


    float offsetLife = rand(vUv);

    vec2 velocity = texture2D(uPositions, vUv).zw;

    velocity *= uFriction;

    vec2 direction = normalize(finalPosition - position);
    float distanceToShape = length(finalPosition - position);
    if (distanceToShape > 0.01) {
        velocity += direction * uAttractionStrength;
    }

    float mouseDistance = distance(position, uPointer.xy);
    float maxDistance = uMouseEffectDistance;
    if (mouseDistance < maxDistance) {
        vec2 direction = normalize(position - uPointer.xy);
        velocity += direction * ( 1. - mouseDistance / maxDistance) * uMouseEffectStrength;
    }

    float lifespan = 2.;
    float age = mod(uTime * 6. + lifespan * offsetLife, lifespan);
    if (age < 0.05) {
        velocity = vec2(0.0001, 0.0001);
        position.xy = finalPosition;
    }

    position.xy += velocity;

    gl_FragColor = vec4(position, velocity);
}