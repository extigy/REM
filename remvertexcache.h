#ifndef REMVERTEXCACHE_H
#define REMVERTEXCACHE_H
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "const.h"
#include "remrender.h"

class REMVertexCache;
class REMVertexCacheManager{
private:
  REMVertexFormat _activeVertexFormat;
  REMVertexCache* temp;
public:
  REMVertexCacheManager(REMSkinManager* s);
  ~REMVertexCacheManager();
  int createBuffer(REMVertexFormat vertexFormat, unsigned int nSkinID, unsigned int nVerts, unsigned int nIndis, const float* pVerts, const unsigned short* pIndis, unsigned int *pnID);
  int render(REMVertexFormat vertexFormat, unsigned int nSkinID, unsigned int nVerts, unsigned int nIndis, const float* pVerts, const unsigned short* pIndis);
  int render(unsigned int nBufferID);
  int forcedFlushAll();
  int forceFlush(REMVertexFormat vertexFormat);
  void setVertexFormat(REMVertexFormat activeVertexFormat);
  unsigned int getActiveCache();
  void setActiveCache(unsigned int cID);;
};

class REMVertexCache{
public:
  REMVertexCache(unsigned int nVertsMax, unsigned int nIndisMax, unsigned int nStride, REMSkinManager* pSkinMan, REMVertexCacheManager *pVCM, unsigned int dwID);
  ~REMVertexCache();

  int flush();
  int add(unsigned int nVerts, unsigned int nIndis, const float* pVerts, const unsigned short* pIndices);
  void setSkin(unsigned int skinID);
  bool usesSkin(unsigned int skinID);
  bool isEmpty();
  int numVerts();

private:
  GLuint _pB[2] = {-1, -1}; //1 - vertex buff, 2 - index buffer
  float* _pVD;
  unsigned short* _pInD;
  REMSkinManager* _pSkinMan;
  REMVertexCacheManager* _pVCM;
  REMSkin _skin;
  unsigned int _skinID;
  unsigned int _dwID;

  unsigned int _nNumVertsMax;
  unsigned int _nNumIndisMax;
  unsigned int _nNumVerts;
  unsigned int _nNumIndis;
  unsigned int _nStride; //stride of a vertex
};

#endif
