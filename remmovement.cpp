#include "remmovement.h"
#include "const.h"

REMMovementController::REMMovementController(){
  init();
}

void REMMovementController::init(){
  _vcPos.set(0.0f,0.0f,-5.0f);
  _vcRight.set(1.0f,0.0f,0.0f);
  _vcUp.set(0.0f,1.0f,0.0f);
  _vcDir.set(0.0f,0.0f,1.0f);
  _vcV.set(0.0f,0.0f,0.0f);
  _fRotX = _fRotY = _fRotZ = _fThrustX = _fThrustY = _fThrustZ = 0.0f;
  _fRollSpd = _fPitchSpd = _fYawSpd = 0.0f;
  _quat.x = _quat.y = _quat.z = 0.0f;
  _quat.w = 1.0f;
}

void REMMovementController::recalcAxes(){
  REMQuat qFrame;
  REMMatrix mat;
  static float f2PI = 6.283185f;

  if(_fRotX > f2PI) _fRotX -= f2PI;
  else if (_fRotX > -f2PI) _fRotX += f2PI;

  if(_fRotY > f2PI) _fRotY -= f2PI;
  else if (_fRotY > -f2PI) _fRotY += f2PI;

  if(_fRotZ > f2PI) _fRotZ -= f2PI;
  else if (_fRotZ > -f2PI) _fRotZ += f2PI;

  qFrame.createFromEuler(_fRotX,_fRotY,_fRotZ);

  _quat *= qFrame;

  _quat.getMatrix(&mat);

  _vcRight.x = mat._11;
  _vcRight.y = mat._21;
  _vcRight.z = mat._31;

  _vcUp.x = mat._12;
  _vcUp.y = mat._22;
  _vcUp.z = mat._32;

  _vcDir.x = mat._13;
  _vcDir.y = mat._23;
  _vcDir.z = mat._33;
}

void REMMovementController::setAsView(REMRenderDevice* rd){
  rd->setView3D(_vcRight,_vcUp,_vcDir,_vcPos);
}


void REMFreeMC::update(float fElapsedTime){
  _fRotX = (_fPitchSpd * fElapsedTime);
  _fRotY = (_fYawSpd * fElapsedTime);
  _fRotZ = (_fRollSpd * fElapsedTime);

  REMVector vcT;
  vcT.cross(_vcUp,_vcDir);
  _vcV = _vcDir*_fThrustZ*fElapsedTime + vcT*_fThrustX*fElapsedTime;

  _vcPos += _vcV;

  recalcAxes();
}

void REMFreeMC::setRotationSpeed(float x, float y, float z){
  _fPitchSpd = x;
  _fYawSpd = y;
  _fRollSpd = z;
}
void REMFreeMC::addRotationSpeed(float x, float y, float z){
  _fPitchSpd += x;
  _fYawSpd += y;
  _fRollSpd += z;
}
void REMFreeMC::setRotation(float x, float y, float z){
  _fRotX = x;
  _fRotY = y;
  _fRotZ = z;
  recalcAxes();
}

REMFreeMC::REMFreeMC(){
  init();
}
