precision highp float;
//Basic Vertex Shader

uniform vec4 worldAmbient;
uniform vec4 dirLightColour;
uniform float pPointLightPower[8];
uniform vec4 pPointLightCol[8];

uniform int nTextures;
uniform vec4 matDiffuse;
uniform vec4 matAmbient;
uniform vec4 matSpecular;
uniform float matPower;

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;

varying float fDirLightAmount;
varying vec2 vTexCoord;
varying vec2 vTexDetailCoord;
varying vec3 pointLightMTP[8];

void main(){
  vec4 pointLight = vec4(0.0);
  vec4 tex  = texture2D(uSampler0, vTexCoord);
  vec4 detail = vec4(1.0);
  if(nTextures==2){
    detail = texture2D(uSampler1, vTexDetailCoord);
  }
  vec4 ambientLight = matAmbient*worldAmbient;
  vec4 diffuseLight = matDiffuse*dirLightColour*max(fDirLightAmount,0.0);
  vec4 finalTexture = tex*detail;
  for(int i=0;i<8;i++){
    pointLight += matDiffuse*pPointLightCol[i]*(1.0-min(max(dot(pointLightMTP[i],pointLightMTP[i]),-1.0),1.0));
  }
  gl_FragColor = (ambientLight+diffuseLight+pointLight)*finalTexture;
}
