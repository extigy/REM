#include "remlight.h"
#include "remshader.h"
#include "remrender.h"
#include <GLES2/gl2.h>

REMLightManager::REMLightManager(REMRenderDevice* r){
  _renderDevice = r;
  _pShaderMan = r->getShaderManager();
  _nBanks = -1;
}

void REMLightManager::setAmbientLight(REMColour cMat){
  _ambientLightColour = cMat;
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "worldAmbient"),1,cMat.c);
  log("Setting ambient light to (%5.3f,%5.3f,%5.3f,%5.3f).",cMat.fR,cMat.fG,cMat.fB,cMat.fA);
}

void REMLightManager::setDirLight(REMColour col, REMVector dir){
  log("Setting directional light (%5.3f,%5.3f,%5.3f,%5.3f), in direction (%5.3f,%5.3f,%5.3f).",col.fR,col.fG,col.fB,col.fA,dir.x,dir.y,dir.z);
  dir.x = -dir.x;
  dir.y = -dir.y;
  dir.z = -dir.z;
  dir.w = 0.0f;
  _dirLightDirection = dir;
  _dirLightColour = col;
  REMVector wLightDir =  _dirLightDirection;
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "dirLightDir"),1,wLightDir._data);
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "dirLightColour"),1,col.c);
}

void REMLightManager::reInitLights(){
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "dirLightDir"),1,_dirLightDirection._data);
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "dirLightColour"),1,_dirLightColour.c);
  enableLightBank(_currentBank);
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "worldAmbient"),1,_ambientLightColour.c);
}

int REMLightManager::addPointLight(REMColour col, REMVector loc, float fRadius){
  addPointLight(col,loc.x,loc.y,loc.z,fRadius);
}

int REMLightManager::enableLightBank(unsigned int bank){
  unsigned int i;
  if(bank > _nBanks) return -1;
  _currentBank= bank;

  unsigned int sp = _pShaderMan->getActiveProgram();
  //glUniform1fv(glGetUniformLocation(sp, "pPointLightPower"),8,_pPointLightPower+_currentBank*8);
  glUniformMatrix4fv(glGetUniformLocation(sp, "pPointLightMTP"),4,0,_pPointLightMTP+_currentBank*4*16);
  glUniform4fv(glGetUniformLocation(sp, "pPointLightCol"),4,_pPointLightCol+_currentBank*4*4);
  glUniform4fv(glGetUniformLocation(sp, "pPointLightPos"),4,_pPointLightCol+_currentBank*4*4);
}

int REMLightManager::addPointLight(REMColour col, float _x, float _y, float _z, float fRadius){
  unsigned int sp,n;

  if(_nPointLights%4 == 0) {//make more lights
    n = _nPointLights + 4;
    _pPointLightCol = (float*)realloc(_pPointLightCol,n*4*sizeof(float));
    _pPointLightPos = (float*)realloc(_pPointLightPos,n*4*sizeof(float));
    _pPointLightMTP = (float*)realloc(_pPointLightMTP,n*16*sizeof(float));
    //_pPointLightPower = (float*)realloc(_pPointLightPower,n*sizeof(float));
    if(!_pPointLightCol) return REMOUTOFMEMORY;
    if(!_pPointLightPos) return REMOUTOFMEMORY;
    if(!_pPointLightMTP) return REMOUTOFMEMORY;
    //if(!_pPointLightPower) return REMOUTOFMEMORY;
    memset(_pPointLightCol+(_nPointLights*4),0,4*4*sizeof(float));
    memset(_pPointLightPos+(_nPointLights*4),0,4*4*sizeof(float));
    memset(_pPointLightMTP+(_nPointLights*16),0,4*16*sizeof(float));
    //memset(_pPointLightPower+(_nPointLights),0,8*sizeof(float));
    _nBanks++;
  }

  memcpy(&(_pPointLightCol[_nPointLights*4]),col.c,4*sizeof(float));
  _pPointLightPos[_nPointLights*4+0] = _x;
  _pPointLightPos[_nPointLights*4+1] = _y;
  _pPointLightPos[_nPointLights*4+2] = _z;
  _pPointLightPos[_nPointLights*4+3] = 0.0f;

  //need a matrix to shift light to required pos
  REMMatrix mS, mTL, mX;
  float invRad = 1.0f/fRadius;

  mS.identity();
  mTL.identity();

  mS._11 = mS._22 = mS._33 = invRad;
  mTL.translate(-_x,-_y,-_z);

  mX = mTL*mS;

  memcpy(&(_pPointLightMTP[_nPointLights*16]),mX._data,16*sizeof(float));
  //_pPointLightPower[_nPointLights] = 1.0f;
  _nPointLights++;

  log("Adding a point light to bank %d: (%5.3f,%5.3f,%5.3f,%5.3f), at (%5.3f,%5.3f,%5.3f,%5.3f).",_nBanks,col.fR,col.fG,col.fB,col.fA,_x,_y,_z);
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
