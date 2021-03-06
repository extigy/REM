precision highp float;
//Basic Vertex Shader

uniform vec4 worldAmbient;
uniform vec4 dirLightColour;
uniform vec4 pPointLightCol[4];

uniform int nTextures;
uniform vec4 matDiffuse;
uniform vec4 matAmbient;
uniform vec4 matSpecular;
uniform float matPower;

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;

varying vec4 vNormal;
varying vec4 vEye;
varying vec2 vTexCoord;
varying vec2 vTexDetailCoord;
varying vec3 pointLightMTP[4];
varying vec3 pointLightRay[4];
varying vec3 vDirLight;

void main(){
  //setup
  vec4 pointLight = vec4(0.0);
  vec4 spec = vec4(0.0);
  vec3 normal = normalize(vec3(vNormal));
  vec3 eye = normalize(vec3(vEye));

  //textures
  vec4 tex  = vec4(1.0,1.0,1.0,1.0);
  vec4 detail = vec4(1.0,1.0,1.0,1.0);
  if(nTextures==1){
    tex  = texture2D(uSampler0, vTexCoord);
  }
  if(nTextures==2){
    detail = texture2D(uSampler1, vTexDetailCoord);
  }
  vec4 finalTexture = tex*detail;

  //ambient
  vec4 ambientLight = matAmbient*worldAmbient;

  //diffuse
  float fDirIntensity = max(dot(normal,vDirLight),0.0);
  if(fDirIntensity > 0.0){
    vec3 h = normalize(vDirLight + eye);
    float intSpec = max(dot(h,normal),0.0);
    spec += matSpecular * dirLightColour * pow(intSpec,matPower);
  }
  vec4 diffuseLight = matDiffuse*dirLightColour*fDirIntensity;

  //point lights
  for(int i=0;i<4;i++){
    float plt = 1.0-min(max(dot(pointLightMTP[i],pointLightMTP[i]),-1.0),1.0);
    if(plt > 0.0){
      pointLight += matDiffuse*pPointLightCol[i]*plt;
      vec3 h = normalize(pointLightRay[i] + eye);
      float intSpec = max(dot(h,normal),0.0);
      //spec += matSpecular * pPointLightCol[i]* pow(intSpec,matPower);
    }
  }

  gl_FragColor = (ambientLight+diffuseLight+pointLight)*finalTexture + spec;
}
