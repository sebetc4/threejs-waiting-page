uniform sampler2D uPositions;

varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 pos = texture2D(uPositions, vUv);    
    vec4 mvPos = modelViewMatrix * vec4(pos.xy, 0., 1.);

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = .8;
}
