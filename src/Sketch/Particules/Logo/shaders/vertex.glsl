uniform sampler2D uPositions;
varying float alpha;

void main() {
    vec4 pos = texture2D(uPositions, uv); 
    float dist = length(pos.xy);

    vec4 mvPos = modelViewMatrix * vec4(pos.xy, 0., 1.);
    alpha = 1.0 - smoothstep(0.0, 3., dist);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = 1.2;
}
