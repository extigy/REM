precision highp float;
uniform vec4 matDiffuse;
uniform vec4 matAmbient;
uniform vec4 matSpecular;
uniform float matPower;
void main(){
  gl_FragColor = matAmbient;
}
