#version 100
//Basic Vertex Shader

uniform mat4 WVPMat;
uniform mat4 WVMat;
uniform mat4 TI_WVMat;
uniform mat4 WMat;
uniform mat4 VMat;
uniform mat4 pPointLightMTP[4];
uniform vec4 pPointLightPos[4];
uniform vec4 dirLightDir;


attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;
attribute vec2 aTexDetailCoord;
attribute vec4 aTangent;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec4 vEye;
varying vec2 vTexCoord;
varying vec2 vTexDetailCoord;
varying vec3 pointLightMTP[4];
varying vec3 pointLightRay[4];
varying vec3 vDirLight;

void main(){
  gl_Position = WVPMat*aPosition;
  vTexCoord = aTexCoord;
  vTexDetailCoord = aTexDetailCoord;

  vNormal = TI_WVMat*aNormal;
  vEye = -(WVMat*aPosition);
  vDirLight = normalize(vec3(VMat*dirLightDir));

  for(int i=0;i<4;i++){
    pointLightMTP[i] = vec3(pPointLightMTP[i]*(WMat*aPosition));
    pointLightRay[i] = normalize(vec3(VMat*(pPointLightPos[i] - (WMat*aPosition))));
  }
}
