#version 100
//Basic Lit Vertex Shader
uniform mat4 WVPMat;
uniform mat4 WVPMatTrans;

attribute vec4 aPosition;
attribute vec4 aColour;
attribute vec2 aTexCoord;

varying vec4 vPosition;
varying vec4 vColour;
varying vec2 vTexCoord;


void main(){
  vPosition = aPosition;
  vColour = aColour;
  vTexCoord = aTexCoord;
  gl_Position = WVPMat*aPosition;
}
