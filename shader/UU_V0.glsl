#version 100
//Basic Vertex Shader
uniform mat4 WVPMat;

attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec2 vTexCoord;


void main(){
  vPosition = aPosition;
  vNormal = aNormal;
  vTexCoord = aTexCoord;
  gl_Position = WVPMat*aPosition;
}
