#ifndef REMRENDER_H
#define REMRENDER_H
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "rem3d.h"
#include "remskin.h"
#include "remshader.h"
#include "remlight.h"
#include "remgeom.h"
#include "const.h"
#include "remvertexcache.h"

class REMVertexCacheManager;
class REMRenderDevice{
friend class REMLightManager;
private:
  REMSkinManager* _pSkinMan;
  REMShaderManager* _pShaderMan;
  REMVertexCacheManager* _pVertexMan;
  REMLightManager* _pLightMan;
  REMRenderState _shadeMode;
  float _fNear, _fFar;
  REMEngineMode _mode;
  int _nStage;
  unsigned int _nActiveSkin;
  bool _bRunning;
  REMViewport _VP[4];

  REMMatrix _mView2D,
            _mView3D,         //camera position/orient in the 3d world
            _mProj2D,         //Projection into 2d space
            _mProjP[4],
            _mProjO[4],
            _mWorld,          //Move 3d data from obj coords to world coords
            _I_mWorldView,
            _mViewProj,       //combined-matrix view with projection
            _mWorldView,
            _mWorldViewProj;  //combined-matrix world with view with projection -> for shaders

public:
  REMColour _clrWire; // colour of wireframe lines
  REMSkinManager* getSkinManager();
  REMShaderManager* getShaderManager();
  REMVertexCacheManager* getVertexManager();
  REMLightManager* getLightManager();
  int setView3D(const REMVector&,const REMVector&,const REMVector&,const REMVector&);
  int setViewLookAt(const REMVector&,const REMVector&,const REMVector&);
  void setClippingPlanes(float,float);
  int setMode(REMEngineMode mode, int nStage);
  void setWorldTransform(const REMMatrix* mWorld);
  int initStage(float, REMViewport*, int n);
  int getFrustum(REMPlane*);
  POINT transform3DTo2D(const REMVector& vcP);
  void transform2DTo3D(const POINT& pt, REMVector* vcOrig, REMVector* vcDir);
  int calcPerspProjMatrix(float fFOV, float fAspect, REMMatrix* m);
  void calcViewProjMatrix();
  void calcWorldViewProjMatrix();
  REMRenderDevice();
  void prepare2D();
  unsigned int getActiveSkinID();
  void setBackfaceCulling(REMRenderState);
  void setDepthBufferMode(REMRenderState);
  void setShadeMode(REMRenderState smd, float f, const REMColour *pClr);
  REMRenderState getShadeMode();
  void setActiveSkinID(unsigned int skinID);
  int oneTimeInit();
};

#endif
