precision highp float;
uniform vec4 matDiffuse;
uniform vec4 matAmbient;
uniform vec4 matSpecular;
uniform float matPower;

uniform sampler2D uSampler0;

varying vec4 vPosition;
varying vec4 vColour;
varying vec2 vTexCoord;

void main(){
  vec4 light  = matAmbient + (vColour*matDiffuse);
  vec4 tex  = texture2D(uSampler0, vTexCoord);
  if(dot(vec3(tex),vec3(1.0,1.0,1.0)) > 0.0) {
    light = light*tex;
  }
  gl_FragColor = tex;
}
