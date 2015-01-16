#include "remrender.h"
#include "const.h"
#include "remshader.h"
#include <GLES2/gl2.h>

REMRenderDevice::REMRenderDevice(){
  _bRunning = true;
};
unsigned int REMRenderDevice::getActiveSkinID(){
  return _nActiveSkin;
}
void REMRenderDevice::setActiveSkinID(unsigned int skinID){
  _nActiveSkin = skinID;
}
REMSkinManager* REMRenderDevice::getSkinManager(){
  return _pSkinMan;
}
REMShaderManager* REMRenderDevice::getShaderManager(){
  return _pShaderMan;
}
REMVertexCacheManager* REMRenderDevice::getVertexManager(){
  return _pVertexMan;
}

int REMRenderDevice::oneTimeInit(){
  _pSkinMan = new REMSkinManager();
  _pShaderMan = new REMShaderManager(this);
  _pVertexMan = new REMVertexCacheManager(this, 300, 450);
  setBackfaceCulling(RS_CULL_NONE);
  glEnable(GL_DEPTH_TEST);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

  REMViewport vpView = {0,0,REMWIDTH,REMHEIGHT};
  _mode = PERSPECTIVE;
  _nStage = -1;
  setActiveSkinID(MAX_ID);
  _clrWire.fR = 1.0f;_clrWire.fG = 1.0f;_clrWire.fB = 1.0f;_clrWire.fA = 1.0f;
  setShadeMode(RS_SHADE_SOLID, NULL, NULL);
  setDepthBufferMode(RS_DEPTH_READWRITE);

  _mView3D.identity();
  setClippingPlanes(0.1f,1000.0f);
  setWorldTransform(NULL);



  _pShaderMan->createVShader("./shader/UL_V0.glsl", true, NULL);
  _pShaderMan->createFShader("./shader/UL_F0.glsl", true, NULL);
  _pShaderMan->createProgram(0, 0, NULL);
  _pShaderMan->activateProgram(0);
  _pShaderMan->createVShader("./shader/UU_V0.glsl", true, NULL);
  _pShaderMan->createFShader("./shader/UU_F0.glsl", true, NULL);
  _pShaderMan->createProgram(1, 1, NULL);
  //_pShaderMan->activateProgram(1);

  //default material
  REMColour cMat;
  cMat.fR = 1.0f;
  cMat.fG = 1.0f;
  cMat.fB = 1.0f;
  cMat.fA = 1.0f;
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "matDiffuse"),1,cMat.c);
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "matAmbient"),1,cMat.c);
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "matSpecular"),1,cMat.c);
  glUniform4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "matEmissive"),1,cMat.c);
  glUniform1f(glGetUniformLocation(_pShaderMan->getActiveProgram(), "matPower"),1.0f);

  initStage(0.9f,&vpView,0);
  setMode(PERSPECTIVE,0);
  return REMOK;
}


int REMRenderDevice::setView3D(const REMVector& vcRight,const REMVector& vcUp,const REMVector& vcDir,const REMVector& vcPos){
  if (!_bRunning) return REMFAIL;
  _mView3D._14 = _mView3D._24 = _mView3D._34 = 0.0f;
  _mView3D._44 = 1.0f;

  _mView3D._11 = vcRight.x;
  _mView3D._21 = vcRight.y;
  _mView3D._31 = vcRight.z;
  _mView3D._41 = -(vcRight*vcPos);

  _mView3D._12 = vcUp.x;
  _mView3D._22 = vcUp.y;
  _mView3D._32 = vcUp.z;
  _mView3D._42 = -(vcUp*vcPos);

  _mView3D._13 = vcDir.x;
  _mView3D._23 = vcDir.y;
  _mView3D._33 = vcDir.z;
  _mView3D._43 = -(vcDir*vcPos);

  calcViewProjMatrix();
  calcWorldViewProjMatrix();
  return REMOK;
}

int REMRenderDevice::setViewLookAt(const REMVector& vcPos,const REMVector& vcPoint,const REMVector& vcWorldUp){
  REMVector vcDir, vcTemp, vcUp;

  vcDir = vcPoint - vcPos;
  vcDir.normalise();

  float fDot = vcWorldUp * vcDir;
  vcTemp = vcDir * fDot;
  vcUp = vcWorldUp - vcTemp;
  float fL = vcUp.getLength();

  if(fL<1e-6f){
    REMVector vcY;
    vcY.set(0.0f,1.0f,0.0f);
    vcTemp = vcDir * vcDir.y;
    vcUp = vcY - vcTemp;

    fL = vcUp.getLength();

    if(fL < 1e-6f){
      vcY.set(0.0f,0.0f,1.0f);
      vcTemp = vcDir * vcDir.z;
      vcUp = vcY - vcTemp;

      fL = vcUp.getLength();
      if(fL < 1e-6) return REMFAIL;
    }
  }
  vcUp /= fL;

  REMVector vcRight;
  vcRight.cross(vcUp,vcDir);

  return setView3D(vcRight, vcUp, vcDir, vcPos);
}

int REMRenderDevice::getFrustum(REMPlane* p){
  p[0]._vcN.x = -(_mViewProj._14 + _mViewProj._11);
  p[0]._vcN.y = -(_mViewProj._24 + _mViewProj._21);
  p[0]._vcN.z = -(_mViewProj._34 + _mViewProj._31);
  p[0]._fD    = -(_mViewProj._44 + _mViewProj._41);

  p[1]._vcN.x = -(_mViewProj._14 - _mViewProj._11);
  p[1]._vcN.y = -(_mViewProj._24 - _mViewProj._21);
  p[1]._vcN.z = -(_mViewProj._34 - _mViewProj._31);
  p[1]._fD    = -(_mViewProj._44 - _mViewProj._41);

  p[2]._vcN.x = -(_mViewProj._14 - _mViewProj._12);
  p[2]._vcN.y = -(_mViewProj._24 - _mViewProj._22);
  p[2]._vcN.z = -(_mViewProj._34 - _mViewProj._32);
  p[2]._fD    = -(_mViewProj._44 - _mViewProj._42);

  p[3]._vcN.x = -(_mViewProj._14 + _mViewProj._12);
  p[3]._vcN.y = -(_mViewProj._24 + _mViewProj._22);
  p[3]._vcN.z = -(_mViewProj._34 + _mViewProj._32);
  p[3]._fD    = -(_mViewProj._44 + _mViewProj._42);

  p[4]._vcN.x = -_mViewProj._13;
  p[4]._vcN.y = -_mViewProj._23;
  p[4]._vcN.z = -_mViewProj._33;
  p[4]._fD    = -_mViewProj._43;

  p[5]._vcN.x = -(_mViewProj._14 - _mViewProj._13);
  p[5]._vcN.y = -(_mViewProj._24 - _mViewProj._23);
  p[5]._vcN.z = -(_mViewProj._34 - _mViewProj._33);
  p[5]._fD    = -(_mViewProj._44 - _mViewProj._43);

  for (int i=0;i<6;i++){
    float fL = p[i]._vcN.getLength();
    p[i]._vcN /= fL;
    p[i]._fD  /= fL;
  }
  return REMOK;
}

void REMRenderDevice::setClippingPlanes(float fNear, float fFar){
  _fNear = fNear;
  _fFar = fFar;

  if(_fNear <= 0.0f) _fNear = 0.01f;
  if(_fFar  <= 1.0f) _fFar = 1.00f;

  if(_fNear >= _fFar){
    _fNear = _fFar;
    _fFar = _fNear + 1.0f;
  }

  prepare2D();

  float Q = 1.0f/(_fFar - _fNear);
  float X = -Q*_fNear;
  _mProjO[0]._33 = _mProjO[1]._33 = Q;
  _mProjO[2]._33 = _mProjO[3]._33 = Q;
  _mProjO[0]._43 = _mProjO[1]._43 = X;
  _mProjO[2]._43 = _mProjO[3]._43 = X;

  Q*=_fFar;
  X = -Q*_fNear;

  _mProjP[0]._33 = _mProjP[1]._33 = Q;
  _mProjP[2]._33 = _mProjP[3]._33 = Q;
  _mProjP[0]._43 = _mProjP[1]._43 = X;
  _mProjP[2]._43 = _mProjP[3]._43 = X;
}

void REMRenderDevice::prepare2D(){
  _mProj2D.identity();
  _mView2D.identity();

  _mProj2D._11 = 2.0f/REMWIDTH;
  _mProj2D._22 = 2.0f/REMHEIGHT;
  _mProj2D._33 = 1.0f/(_fFar-_fNear);
  _mProj2D._43 = -_fNear*(1.0f/(_fFar-_fNear));
  _mProj2D._44 = 1.0f;

  float tx,ty,tz;
  tx = -((int)REMWIDTH) + REMWIDTH*0.5f;
  ty = REMHEIGHT - REMHEIGHT*0.5f;
  tz = _fNear + 0.1f;

  _mView2D._22 = -1.0f;
  _mView2D._41 = tx;
  _mView2D._42 = ty;
  _mView2D._43 = tz;

}

int REMRenderDevice::calcPerspProjMatrix(float fFOV, float fAspect, REMMatrix* m){
  if(fabs(_fFar - _fNear) < 0.01f) return REMFAIL;

  float sinFOV2 = sinf(fFOV/2);

  if(fabs(sinFOV2)<0.01f) return REMFAIL;

  float cosFOV2 = cosf(fFOV/2);

  float w = fAspect*(cosFOV2/sinFOV2);
  float h = 1.0f*(cosFOV2/sinFOV2);
  float Q = _fFar/(_fFar-_fNear);

  m->identity();

  m->_11=w;
  m->_22=h;
  m->_33=Q;
  m->_34=1.0f;
  m->_43=-Q*_fNear;
  m->_44=0.0f;
  return REMOK;
}

void REMRenderDevice::calcViewProjMatrix(){
  REMMatrix* pA;
  REMMatrix* pB;

  if(_mode == TWOD){
    pA = &_mProj2D;
    pB = &_mView2D;
  } else {
    pB = &_mView3D;
    if(_mode == PERSPECTIVE){
      pA = &(_mProjP[_nStage]);
    } else {
      pA = &(_mProjO[_nStage]);
    }
  }
  REMMatrix* pM = &_mViewProj;
  (*pM) = (*pA)*(*pB);
}

void REMRenderDevice::calcWorldViewProjMatrix(){
  REMMatrix* pProj;
  REMMatrix* pView;
  REMMatrix* pWorld;

  pWorld = &_mWorld;
  if(_mode == TWOD){
    pProj = &_mProj2D;
    pView = &_mView2D;
  } else {
    pView = &_mView3D;
    if(_mode == PERSPECTIVE){
      pProj = &(_mProjP[_nStage]);
    } else {
      pProj = &(_mProjO[_nStage]);
    }
  }
  REMMatrix* pCombo = &_mWorldViewProj;
  (*pCombo) = ((*pWorld)*(*pView))*(*pProj);
  glUniformMatrix4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "WVPMat"),1,0,_mWorldViewProj._data);
  glUniformMatrix4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "WVPMatTrans"),1,1,_mWorldViewProj._data);

}


int REMRenderDevice::setMode(REMEngineMode mode, int nStage){
  int vpX,vpY,vpW,vpH;

  if (!_bRunning){
    return REMFAIL;
  }
  if (nStage > 3 || nStage < 0){
    nStage = 0;
  }
  if (_mode != mode){
    _mode = mode;
  }

  _pVertexMan->forcedFlushAll();

  if (mode == TWOD){
    vpX			= 0;
    vpY			= 0;
    vpW			= REMWIDTH;
    vpH			= REMHEIGHT;
    glViewport(vpY, vpX, vpW, vpH);
  } else {
    _nStage = nStage;
    vpX = _VP[nStage].x;
    vpY = _VP[nStage].y;
    vpW = _VP[nStage].width;
    vpH = _VP[nStage].height;
    glViewport(vpY, vpX, vpW, vpH);
    calcViewProjMatrix();
    calcWorldViewProjMatrix();
  }
  return REMOK;
}

int REMRenderDevice::initStage(float fFOV, REMViewport* pView, int nStage){
  float fAspect;
  bool  bOwnRect=false;

  if (!pView){
    REMViewport vpOwn = { 0, 0, REMWIDTH, REMHEIGHT};
    memcpy(&_VP[nStage], &vpOwn, sizeof(REMViewport));
  } else {
    memcpy(&_VP[nStage], pView, sizeof(REMViewport));
  }

  if (nStage > 3 || nStage < 0) nStage = 0;

  fAspect = (float)(_VP[nStage].height) / _VP[nStage].width;

  calcPerspProjMatrix(fFOV, fAspect, &_mProjP[nStage]);

  _mProjO[nStage].identity();
  _mProjO[nStage]._11 = 2.0f / _VP[nStage].width;
  _mProjO[nStage]._22 = 2.0f / _VP[nStage].height;
  _mProjO[nStage]._33 = 1.0f / (_fFar - _fNear);
  _mProjO[nStage]._43 = -(_fNear * _mProjO[nStage]._33);
  _mProjO[nStage]._44 = 1.0f;
  return REMOK;
}

POINT REMRenderDevice::transform3DTo2D(const REMVector& vcPoint){
  POINT pt;
  float fClip_x, fClip_y;
  float fXp, fYp, fWp;
  int width, height;

  if (_mode == TWOD){
    width = REMWIDTH;
    height = REMHEIGHT;
  } else {
    width = _VP[_nStage].width;
    height = _VP[_nStage].height;
  }
  fClip_x = (float)(width  >> 1);
  fClip_y = (float)(height >> 1);

  fXp = (_mViewProj._11*vcPoint.x) + (_mViewProj._21*vcPoint.y) + (_mViewProj._31*vcPoint.z) + _mViewProj._41;
  fYp = (_mViewProj._12*vcPoint.x) + (_mViewProj._22*vcPoint.y) + (_mViewProj._32*vcPoint.z) + _mViewProj._42;
  fWp = (_mViewProj._14*vcPoint.x) + (_mViewProj._24*vcPoint.y) + (_mViewProj._34*vcPoint.z) + _mViewProj._44;

  float fWpInv = 1.0f / fWp;

  pt.x = (unsigned int)((1.0f + (fXp * fWpInv)) * fClip_x);
  pt.y = (unsigned int)((1.0f + (fYp * fWpInv)) * fClip_y);
  return pt;
}

void REMRenderDevice::transform2DTo3D(const POINT& pt, REMVector* vcOrig, REMVector* vcDir){
  REMMatrix* pView = NULL;
  REMMatrix* pProj = NULL;
  REMMatrix mInvView;
  REMVector vcS;
  int	  width, height;

  if (_mode == TWOD){
    width = REMWIDTH;
    height = REMHEIGHT;
    pView = &_mView2D;
  } else {
    width = _VP[_nStage].width;
    height = _VP[_nStage].height;
    pView = &_mView3D;

    if (_mode == PERSPECTIVE){
      pProj = &_mProjP[_nStage];
    } else {
      pProj = &_mProjO[_nStage];
    }
  }
  vcS.x = (((pt.x*2.0f) / width) - 1.0f) / _mProjP[_nStage]._11;
  vcS.y = (((pt.y*2.0f) / height) - 1.0f) / _mProjP[_nStage]._22;
  vcS.z = 1.0f;

  mInvView.inverseOf(_mView3D);

  (*vcDir).x = (vcS.x * mInvView._11) + (vcS.y * mInvView._21) + (vcS.z * mInvView._31);
  (*vcDir).y = (vcS.x * mInvView._12) + (vcS.y * mInvView._22) + (vcS.z * mInvView._32);
  (*vcDir).z = (vcS.x * mInvView._13) + (vcS.y * mInvView._23) + (vcS.z * mInvView._33);

  (*vcOrig).x = mInvView._41;
  (*vcOrig).y = mInvView._42;
  (*vcOrig).z = mInvView._43;

  (*vcDir).normalise();
}

void REMRenderDevice::setWorldTransform(const REMMatrix* mWorld){
  _pVertexMan->forcedFlushAll();

  if (!mWorld){
    _mWorld.identity();
  } else {
    memcpy(&_mWorld, mWorld, sizeof(REMMatrix));
  }

  GLuint activeProg = _pShaderMan->getActiveProgram();
  calcWorldViewProjMatrix();
}

void REMRenderDevice::setBackfaceCulling(REMRenderState rs){
  _pVertexMan->forcedFlushAll();
  if(rs == RS_CULL_CW) {
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
  } else if(rs == RS_CULL_CCW){
    glEnable(GL_CULL_FACE);
    glCullFace(GL_FRONT);
  } else if(rs == RS_CULL_NONE){
    glDisable(GL_CULL_FACE);
  }
}

void REMRenderDevice::setDepthBufferMode(REMRenderState rs){
  _pVertexMan->forcedFlushAll();
  if(rs == RS_DEPTH_READWRITE){
    glEnable(GL_DEPTH_TEST);
    glDepthMask(GL_TRUE);
    glClear(GL_DEPTH_BUFFER_BIT);
  } else if(rs == RS_DEPTH_READONLY){
    glEnable(GL_DEPTH_TEST);
    glClear(GL_DEPTH_BUFFER_BIT);
    glDepthMask(GL_FALSE);
  } else if(rs == RS_DEPTH_NONE){
    glDisable(GL_DEPTH_TEST);
    glDepthMask(GL_TRUE);
    glClear(GL_DEPTH_BUFFER_BIT);
  }
}

void REMRenderDevice::setShadeMode(REMRenderState smd, float f, const REMColour *pClr){
  _pVertexMan->forcedFlushAll();
  if(pClr){
    memcpy(&_clrWire,pClr,sizeof(REMColour));
    //_pVertexMan->invalidateStates();
  }

  if(smd != _shadeMode){
    _shadeMode = smd;
  }
  //_pVertexMan->invalidateStates();
}

REMRenderState REMRenderDevice::getShadeMode(){
  return _shadeMode;
}
