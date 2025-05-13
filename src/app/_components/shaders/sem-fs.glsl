uniform sampler2D tStencil;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(tStencil, vUv);
  gl_FragColor = tex;
}
