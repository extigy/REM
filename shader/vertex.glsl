#version 100
uniform mat4 WVPMat;
uniform mat4 WVPMatTrans;
attribute vec4 vPosition;
void main(){
   gl_Position = WVPMat*vPosition;
}
