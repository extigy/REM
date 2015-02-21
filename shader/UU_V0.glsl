#version 100
//Basic Vertex Shader

uniform mat4 WVPMat;
uniform mat4 WInv;
uniform mat4 W;
uniform vec4 dirLightDir;
uniform mat4 pPointLightMTP[8];

attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;
attribute vec2 aTexDetailCoord;
attribute vec4 aTangent;

varying vec4 vPosition;
varying vec2 vTexCoord;
varying vec2 vTexDetailCoord;
varying float fDirLightAmount;
varying vec3 pointLightMTP[8];

void main(){
  vTexCoord = aTexCoord;
  vTexDetailCoord = aTexDetailCoord;

  vec4 lightdir  = WInv*dirLightDir;
  fDirLightAmount = dot(vec3(aNormal),vec3(lightdir));
  gl_Position = WVPMat*aPosition;
  for(int i=0;i<8;i++){
    pointLightMTP[i] = vec3(pPointLightMTP[i]*(W*aPosition));
  }
}
