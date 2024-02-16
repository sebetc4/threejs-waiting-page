uniform sampler2D uPositions;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 newPos = position;
    vec4 currentPos = texture2D(uPositions, vUv);

    newPos.xy = currentPos.xy;
    
    vec4 mvPos = modelViewMatrix * vec4(newPos, 1.);

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = 2. * ( 1. / -mvPos.z );
}
