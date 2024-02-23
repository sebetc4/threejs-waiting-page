uniform float uAlpha; 
uniform vec3 uLogoColor;
uniform vec3 uTextColor;
uniform float uLogoTextMix;

void main() {
    vec3 color = mix(uLogoColor, uTextColor, uLogoTextMix);
    gl_FragColor = vec4(color, uAlpha);
}