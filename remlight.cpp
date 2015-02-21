#include "remlight.h"
#include "remshader.h"
#include "remrender.h"
#include <GLES2/gl2.h>

REMLightManager::REMLightManager(REMRenderDevice* r){
  _renderDevice = r;
  _pShaderMan = r->getShaderManager();
}

void REMLightManager::setAmbientLight(REMColour cMat){
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "worldAmbient"),1,cMat.c);
  log("Setting ambient light to (%5.3f,%5.3f,%5.3f,%5.3f).",cMat.fR,cMat.fG,cMat.fB,cMat.fA);
}

void REMLightManager::setDirLight(REMColour col, REMVector dir){
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "dirLightDir"),1,dir._data);
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "dirLightColour"),1,col.c);
  log("Setting directional light (%5.3f,%5.3f,%5.3f,%5.3f), in direction (%5.3f,%5.3f,%5.3f,%5.3f).",col.fR,col.fG,col.fB,col.fA,dir.x,dir.y,dir.z);
}
int REMLightManager::addPointLight(REMColour col, REMVector loc, float fRadius){
  addPointLight(col,loc.x,loc.y,loc.z,fRadius);
}

int REMLightManager::enableLightBank(unsigned int bank){
  if(bank + 1 > _nBanks) return -1;
  currentLightBankOffset = bank;
}

int REMLightManager::addPointLight(REMColour col, float _x, float _y, float _z, float fRadius){
  unsigned int sp,n;

  if(_nPointLights%8 == 0) {//make more lights
    n = _nPointLights + 8;
    _pPointLightCol = (float*)realloc(_pPointLightCol,n*4*sizeof(float));
    _pPointLightMTP = (float*)realloc(_pPointLightMTP,n*16*sizeof(float));
    _pPointLightPower = (float*)realloc(_pPointLightPower,n*sizeof(float));
    if(!_pPointLightCol) return REMOUTOFMEMORY;
    if(!_pPointLightMTP) return REMOUTOFMEMORY;
    if(!_pPointLightPower) return REMOUTOFMEMORY;
    _nBanks++;
  }

  memcpy(&(_pPointLightCol[_nPointLights*4]),col.c,4*sizeof(float));

  //need a matrix to shift light to required pos
  REMMatrix mS, mTL, mX;
  float invRad = 1.0f/fRadius;

  mS.identity();
  mTL.identity();

  mS._11 = mS._22 = mS._33 = invRad;
  mTL.translate(-_x,-_y,-_z);

  mX = mTL*mS;

  memcpy(&(_pPointLightMTP[_nPointLights*16]),mX._data,16*sizeof(float));
  _pPointLightPower[_nPointLights] = 1.0f;
  _nPointLights++;

  log("Adding a point light (%5.3f,%5.3f,%5.3f,%5.3f), at (%5.3f,%5.3f,%5.3f,%5.3f).",col.fR,col.fG,col.fB,col.fA,_x,_y,_z);
  sp = _pShaderMan->getActiveProgram();
  glUniform1fv(glGetUniformLocation(sp, "pPointLightPower"),8,_pPointLightPower+currentLightBankOffset*8);
  glUniformMatrix4fv(glGetUniformLocation(sp, "pPointLightMTP"),8,0,_pPointLightMTP+currentLightBankOffset*8*16);
  glUniform4fv(glGetUniformLocation(sp, "pPointLightCol"),8,_pPointLightCol+currentLightBankOffset*4*8);

  return REMOK;
}


void REMLightManager::log(char* chString,...){
  va_list args;
  va_start(args, chString);
  printf("[LightManager]: ");
  vprintf(chString, args);
  printf("\n");
  va_end(args);
}
