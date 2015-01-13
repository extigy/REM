precision highp float;
uniform vec4 matDiffuse;
uniform vec4 matAmbient;
uniform vec4 matSpecular;
uniform float matPower;

varying vec4 vPosition;
varying vec4 vColour;

void main(){
  gl_FragColor = vColour*matDiffuse;
}
