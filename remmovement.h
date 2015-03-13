#ifndef REMMOVEMENT_H
#define REMMOVEMENT_H
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include "const.h"
#include "rem3d.h"
#include "rem4d.h"
#include "remrender.h"

class REMMovementController{
public:
  REMMovementController();
  virtual ~REMMovementController(){}
  virtual void update(float fElapsedTime) = 0;

  virtual void setAsView(REMRenderDevice* rd);
  REMVector getPos() {return _vcPos;}
  REMVector getRight() {return _vcRight;}
  REMVector getUp() {return _vcUp;}
  REMVector getDir() {return _vcDir;}
  REMVector getVelocity() {return _vcV;}

protected:
  REMVector _vcPos;
  REMVector _vcRight;
  REMVector _vcUp;
  REMVector _vcDir;
  REMVector _vcV;
  REMQuat _quat;

  float _fRollSpd;
  float _fPitchSpd;
  float _fYawSpd;

  float _fRollSpdMax;
  float _fPitchSpdMax;
  float _fYawSpdMax;

  float _fRotX;
  float _fRotY;
  float _fRotZ;

  float _fThrustX;
  float _fThrustY;
  float _fThrustZ;

  virtual void recalcAxes();
  virtual void init();
};

class REMFreeMC : public REMMovementController {
public:
  REMFreeMC();
  virtual ~REMFreeMC(){}
  virtual void update(float fElapsedTime);
  void addRotationSpeed(float x, float y, float z);
  void setRotationSpeed(float x, float y, float z);
  void setRotationSpeedX(float f){_fPitchSpd=f;}
  void setRotationSpeedY(float f){_fYawSpd=f;}
  void setRotationSpeedZ(float f){_fRollSpd=f;}
  void addThrustX(float f){_fThrustX += f;}
  void setThrustX(float f){_fThrustX = f;}
  void addThrustY(float f){_fThrustY += f;}
  void setThrustY(float f){_fThrustY = f;}
  void addThrustZ(float f){_fThrustZ += f;}
  void setThrustZ(float f){_fThrustZ = f;}

  void setRotation(float rx, float ry, float rz);
  void setPos(REMVector &vc){memcpy(&_vcPos,&vc,sizeof(REMVector));}
  void setRight(REMVector &vc){memcpy(&_vcRight,&vc,sizeof(REMVector));}
  void setUp(REMVector &vc){memcpy(&_vcUp,&vc,sizeof(REMVector));}
  void setDir(REMVector &vc){memcpy(&_vcDir,&vc,sizeof(REMVector));}
};



#endif
