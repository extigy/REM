#version 100
//Basic Cel Vertex Shader
uniform mat4 WVPMat;
uniform mat4 WVMat;
uniform mat4 TI_WVMat;
uniform mat4 VMat;

attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;
attribute vec2 aTexDetailCoord;
attribute vec4 aTangent;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec4 vEye;

void main(){
  vNormal = TI_WVMat*aNormal;
  vEye = -WVMat*aPosition;

  mat4 scale = mat4(
   1.14, 0.0, 0.0, 0.0,
   0.0, 1.14, 0.0, 0.0,
   0.0, 0.0, 1.14, 0.0,
   0.0, 0.0, 0.0, 1.0
  );

  gl_Position = WVPMat*(scale*aPosition);
}
