uniform sampler2D uPositions;

void main() {

    vec3 newPos = position;
    vec4 pos = texture2D(uPositions, uv);

    newPos.xy = pos.xy;
 
    vec4 mvPos = modelViewMatrix * vec4(newPos, 1.0);

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = 2. * ( 1. / -mvPos.z );

}
