#ifndef REMLIGHT_H
#define REMLIGHT_H
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include "const.h"
#include "rem3d.h"

class REMRenderDevice;
class REMShaderManager;

class REMLightManager{
private:
  REMRenderDevice* _renderDevice;
  REMShaderManager* _pShaderMan;
  REMVector _dirLightDirection;
  REMColour _dirLightColour;
  REMColour ambientLightColour;
  unsigned int _nPointLights;
  float* _pPointLightPower;
  float* _pPointLightMTP;
  float* _pPointLightCol;
  float* _pPointLightPos;
  unsigned int _currentBank;
  unsigned int _nBanks;
public:
  REMLightManager(REMRenderDevice* r);
  ~REMLightManager();
  void log(char*,...);
  void setAmbientLight(REMColour cMat);
  void setDirLight(REMColour col, REMVector dir);
  int addPointLight(REMColour col, REMVector loc,float radius);
  int addPointLight(REMColour col, float x, float y, float z,float radius);
  int enableLightBank(unsigned int bank);
  void updateDirLight();
};



#endif
