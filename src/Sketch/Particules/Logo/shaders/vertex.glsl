uniform sampler2D uPositions;

void main() {
    vec4 pos = texture2D(uPositions, uv); 
    vec4 mvPos = modelViewMatrix * vec4(pos.xy, 0., 1.);

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = 0.8;
}
