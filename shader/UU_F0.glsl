precision highp float;
//Basic Vertex Shader
uniform vec4 matDiffuse;
uniform vec4 matAmbient;
uniform vec4 matSpecular;
uniform float matPower;

uniform sampler2D uSampler0;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec2 vTexCoord;

void main(){
  vec4 tex  = texture2D(uSampler0, vTexCoord);
  gl_FragColor = tex*matDiffuse;
}
