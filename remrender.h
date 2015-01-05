#ifndef REMRENDER_H
#define REMRENDER_H
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "rem3d.h"
#include "remskin.h"
#include "remshader.h"
#include "remgeom.h"

typedef enum REMRENDERSTATE_TYPE{
  RS_CULL_CW,
  RS_CULL_CCW,
  RS_CULL_NONE,
  RS_DEPTH_READWRITE,
  RS_DEPTH_READONLY,
  RS_DEPTH_NONE,
  RS_SHADE_POINTS,
  RS_SHADE_TRIWIRE,
  RS_SHADE_HULLWIRE,
  RS_SHADE_SOLID
} REMRenderState;

typedef struct POINT_TYPE{
  unsigned int x;
  unsigned int y;
} POINT;

typedef struct REMVIEWPORT_TYPE{
unsigned int x;
unsigned int y;
unsigned int width;
unsigned int height;
} REMViewport;

typedef enum REMENGINEMODE_TYPE{
  PERSPECTIVE,
  TWOD,
  ORTHOGONAL
} REMEngineMode;

class REMRenderDevice{
private:
  REMSkinManager* _pSkinMan;
  REMShaderManager* _pShaderMan;
  float _fNear, _fFar;
  REMEngineMode _mode;
  int _nStage;
  bool _bRunning;
  REMViewport _VP[4];

  REMMatrix _mView2D,
            _mView3D,         //camera position/orient in the 3d world
            _mProj2D,         //Projection into 2d space
            _mProjP[4],
            _mProjO[4],
            _mWorld,          //Move 3d data from obj coords to world coords
            _mViewProj,       //combined-matrix view with projection
            _mWorldViewProj;  //combined-matrix world with view with projection -> for shaders

public:
  REMSkinManager* getSkinManager();
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
};

#endif
