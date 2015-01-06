#ifndef REMRENDER_H
#define REMRENDER_H
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "rem3d.h"
#include "remskin.h"
#include "remgeom.h"
#include "const.h"
#include "remvertexcache.h"
class REMShaderManager;
class REMVertexCacheManager;
class REMRenderDevice{
private:
  REMSkinManager* _pSkinMan;
  REMShaderManager* _pShaderMan;
  REMVertexCacheManager* _pVertexMan;
  REMColour _clrWire; // colour of wireframe lines
  REMRenderState _shadeMode;
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
  REMShaderManager* getShaderManager();
  REMVertexCacheManager* getVertexManager();
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

  void setBackfaceCulling(REMRenderState);
  void setDepthBufferMode(REMRenderState);
  void setShadeMode(REMRenderState smd, float f, const REMColour *pClr);
  REMRenderState getShadeMode();
};

class REMShaderManager{
private:
  REMRenderDevice* _renderDevice;
  GLuint          _pVShader[MAX_ID];
  REMVertexFormat _pVertexFormat[MAX_ID];
  REMVertexFormat _pVertexFormatProgram[MAX_ID];
  GLuint          _pFShader[MAX_ID];
  GLuint          _pProgram[MAX_ID];
  unsigned int _nNumVShaders;
  unsigned int _nNumFShaders;
  unsigned int _nNumPrograms;
  GLuint _activeProgram;
public:
  REMShaderManager(REMRenderDevice* renderDevice);
  int createVShader(const char *pData, bool bLoadFromFile, REMVertexFormat vertexFormat, unsigned int* pID);
  int createFShader(const char *pData, bool bLoadFromFile, unsigned int* pID);
  int createProgram(unsigned int vID, unsigned int fID, unsigned int* pID);
  int activateProgram(unsigned int pID);
  GLuint getActiveProgram();
};


#endif
