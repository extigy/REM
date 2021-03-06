#version 100
//Basic Cel Vertex Shader

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
attribute vec4 aTangent;

varying vec4 vNormal;
varying vec4 vEye;
varying vec3 pointLightMTP[4];
varying vec3 vDirLight;
varying float isEdge;

void main(){
  vec4 shift = vec4(
   (0.1*float(aPosition[0]>0.0)-0.05)/abs(WMat[0][0]),
   (0.1*float(aPosition[1]>0.0)-0.05)/abs(WMat[1][1]),
   (0.1*float(aPosition[2]>0.0)-0.05)/abs(WMat[2][2]),
   0.0
  );

  vNormal = TI_WVMat*aNormal;
  vEye = -WVMat*aPosition;
  vDirLight = normalize(vec3(VMat*dirLightDir));
  isEdge = float(dot(normalize(vec3(vNormal)),normalize(vec3(-vEye)))>0.0);
  gl_Position = WVPMat*(isEdge*aPosition+(1.0-isEdge)*(aPosition-shift));

  for(int i=0;i<4;i++){
    pointLightMTP[i] = vec3(pPointLightMTP[i]*(WMat*aPosition));
  }
}
