#version 100
uniform mat4 WVPMat;
uniform mat4 WVPMatTrans;

attribute vec4 aPosition;
attribute vec4 aNormal;

varying vec4 vPosition;
varying vec4 vNormal;

void main(){
  vPosition = aPosition;
  vNormal = aNormal;
  gl_Position = WVPMat*aPosition;
}
