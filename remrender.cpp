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

  _pShaderMan->createVShader("./shader/vertex.glsl", true,UL_VERTEX, NULL);
  _pShaderMan->createFShader("./shader/fragment.glsl", true, NULL);
  _pShaderMan->createProgram(0, 0, NULL);
  _pShaderMan->activateProgram(0);

  initStage(0.8f,&vpView,0);
  setMode(PERSPECTIVE,0);

  return REMOK;
}


int REMRenderDevice::setView3D(const REMVector& vcRight,const REMVector& vcUp,const REMVector& vcDir,const REMVector& vcPos){
  if (!_bRunning) return REMFAIL;
  _mView3D._data[0][3] = _mView3D._data[1][3] = _mView3D._data[2][3] = 0.0f;
  _mView3D._data[3][3] = 1.0f;

  _mView3D._data[0][0] = vcRight.x;
  _mView3D._data[1][0] = vcRight.y;
  _mView3D._data[2][0] = vcRight.z;
  _mView3D._data[3][0] = -(vcRight*vcPos);

  _mView3D._data[0][1] = vcUp.x;
  _mView3D._data[1][1] = vcUp.y;
  _mView3D._data[2][1] = vcUp.z;
  _mView3D._data[3][1] = -(vcUp*vcPos);

  _mView3D._data[0][2] = vcDir.x;
  _mView3D._data[1][2] = vcDir.y;
  _mView3D._data[2][2] = vcDir.z;
  _mView3D._data[3][2] = -(vcDir*vcPos);

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
  p[0]._vcN.x = -(_mViewProj._data[0][3] + _mViewProj._data[0][0]);
  p[0]._vcN.y = -(_mViewProj._data[1][3] + _mViewProj._data[1][0]);
  p[0]._vcN.z = -(_mViewProj._data[2][3] + _mViewProj._data[2][0]);
  p[0]._fD    = -(_mViewProj._data[3][3] + _mViewProj._data[3][0]);

  p[1]._vcN.x = -(_mViewProj._data[0][3] - _mViewProj._data[0][0]);
  p[1]._vcN.y = -(_mViewProj._data[1][3] - _mViewProj._data[1][0]);
  p[1]._vcN.z = -(_mViewProj._data[2][3] - _mViewProj._data[2][0]);
  p[1]._fD    = -(_mViewProj._data[3][3] - _mViewProj._data[3][0]);

  p[2]._vcN.x = -(_mViewProj._data[0][3] - _mViewProj._data[0][1]);
  p[2]._vcN.y = -(_mViewProj._data[1][3] - _mViewProj._data[1][1]);
  p[2]._vcN.z = -(_mViewProj._data[2][3] - _mViewProj._data[2][1]);
  p[2]._fD    = -(_mViewProj._data[3][3] - _mViewProj._data[3][1]);

  p[3]._vcN.x = -(_mViewProj._data[0][3] + _mViewProj._data[0][1]);
  p[3]._vcN.y = -(_mViewProj._data[1][3] + _mViewProj._data[1][1]);
  p[3]._vcN.z = -(_mViewProj._data[2][3] + _mViewProj._data[2][1]);
  p[3]._fD    = -(_mViewProj._data[3][3] + _mViewProj._data[3][1]);

  p[4]._vcN.x = -_mViewProj._data[0][2];
  p[4]._vcN.y = -_mViewProj._data[1][2];
  p[4]._vcN.z = -_mViewProj._data[2][2];
  p[4]._fD    = -_mViewProj._data[3][2];

  p[5]._vcN.x = -(_mViewProj._data[0][3] - _mViewProj._data[0][2]);
  p[5]._vcN.y = -(_mViewProj._data[1][3] - _mViewProj._data[1][2]);
  p[5]._vcN.z = -(_mViewProj._data[2][3] - _mViewProj._data[2][2]);
  p[5]._fD    = -(_mViewProj._data[3][3] - _mViewProj._data[3][2]);

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
  _mProjO[0]._data[2][2] = _mProjO[1]._data[2][2] = Q;
  _mProjO[2]._data[2][2] = _mProjO[3]._data[2][2] = Q;
  _mProjO[0]._data[3][2] = _mProjO[1]._data[3][2] = X;
  _mProjO[2]._data[3][2] = _mProjO[3]._data[3][2] = X;

  Q*=_fFar;
  X = -Q*_fNear;

  _mProjP[0]._data[2][2] = _mProjP[1]._data[2][2] = Q;
  _mProjP[2]._data[2][2] = _mProjP[3]._data[2][2] = Q;
  _mProjP[0]._data[3][2] = _mProjP[1]._data[3][2] = X;
  _mProjP[2]._data[3][2] = _mProjP[3]._data[3][2] = X;
}

void REMRenderDevice::prepare2D(){
  _mProj2D.identity();
  _mView2D.identity();

  _mProj2D._data[0][0] = 2.0f/REMWIDTH;
  _mProj2D._data[1][1] = 2.0f/REMHEIGHT;
  _mProj2D._data[2][2] = 1.0f/(_fFar-_fNear);
  _mProj2D._data[3][2] = -_fNear*(1.0f/(_fFar-_fNear));
  _mProj2D._data[3][3] = 1.0f;

  float tx,ty,tz;
  tx = -((int)REMWIDTH) + REMWIDTH*0.5f;
  ty = REMHEIGHT - REMHEIGHT*0.5f;
  tz = _fNear + 0.1f;

  _mView2D._data[1][1] = -1.0f;
  _mView2D._data[3][0] = tx;
  _mView2D._data[3][1] = ty;
  _mView2D._data[3][2] = tz;
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

  m->_data[0][0]=w;
  m->_data[1][1]=h;
  m->_data[2][2]=Q;
  m->_data[2][3]=1.0f;
  m->_data[3][2]=-Q*_fNear;
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

  //_mWorldViewProj.transposeOf(_mWorldViewProj);
  glUniformMatrix4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "WVPMat"),1,0,&(_mWorldViewProj._data[0][0]));
  glUniformMatrix4fv(glGetUniformLocation(_pShaderMan->getActiveProgram(), "WVPMatTrans"),1,1,&(_mWorldViewProj._data[0][0]));

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

  if (this->calcPerspProjMatrix(fFOV, fAspect, &_mProjP[nStage]) < 0) return REMFAIL;

  _mProjO[nStage].identity();
  _mProjO[nStage]._data[0][0] = 2.0f / _VP[nStage].width;
  _mProjO[nStage]._data[1][1] = 2.0f / _VP[nStage].height;
  _mProjO[nStage]._data[2][2] = 1.0f / (_fFar - _fNear);
  _mProjO[nStage]._data[3][2] = -(_fNear * _mProjO[nStage]._data[2][2]);
  _mProjO[nStage]._data[3][3] = 1.0f;
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

  fXp = (_mViewProj._data[0][0]*vcPoint.x) + (_mViewProj._data[1][0]*vcPoint.y) + (_mViewProj._data[2][0]*vcPoint.z) + _mViewProj._data[3][0];
  fYp = (_mViewProj._data[0][1]*vcPoint.x) + (_mViewProj._data[1][1]*vcPoint.y) + (_mViewProj._data[2][1]*vcPoint.z) + _mViewProj._data[3][1];
  fWp = (_mViewProj._data[0][3]*vcPoint.x) + (_mViewProj._data[1][3]*vcPoint.y) + (_mViewProj._data[2][3]*vcPoint.z) + _mViewProj._data[3][3];

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
  vcS.x = (((pt.x*2.0f) / width) - 1.0f) / _mProjP[_nStage]._data[0][0];
  vcS.y = (((pt.y*2.0f) / height) - 1.0f) / _mProjP[_nStage]._data[1][1];
  vcS.z = 1.0f;

  mInvView.inverseOf(_mView3D);

  (*vcDir).x = (vcS.x * mInvView._data[0][0]) + (vcS.y * mInvView._data[1][0]) + (vcS.z * mInvView._data[2][0]);
  (*vcDir).y = (vcS.x * mInvView._data[0][1]) + (vcS.y * mInvView._data[1][1]) + (vcS.z * mInvView._data[2][1]);
  (*vcDir).z = (vcS.x * mInvView._data[0][2]) + (vcS.y * mInvView._data[1][2]) + (vcS.z * mInvView._data[2][2]);

  (*vcOrig).x = mInvView._data[3][0];
  (*vcOrig).y = mInvView._data[3][1];
  (*vcOrig).z = mInvView._data[3][2];

  (*vcDir).normalise();
}

void REMRenderDevice::setWorldTransform(const REMMatrix* mWorld){
  _pVertexMan->forcedFlushAll();

  if (!mWorld){
    _mWorld.identity();
  } else {
    memcpy(&_mWorld, mWorld, sizeof(REMMatrix));
  }

  calcWorldViewProjMatrix();
  GLuint activeProg = _pShaderMan->getActiveProgram();
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
