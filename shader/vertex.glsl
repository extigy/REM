#version 100
uniform mat4 wvpmTranspose;
uniform float f0;
attribute vec3 vPosition;
void main(){
   gl_Position = vec4(f0*vPosition,1.0);
}
