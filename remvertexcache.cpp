#include "remvertexcache.h"
#include <GLES2/gl2.h>
REMVertexCacheManager::REMVertexCacheManager(REMSkinManager* s){
  temp = new REMVertexCache(10, 10, 12,s,this, 0);
  printf("Created Vertex Cache with ID: 0\n");
  ///HOW TO UPLOAD ATTRIBUTE DATA - VBOs
  float points[] = {
    0.0f,  0.5f,  0.0f,
    0.5f, -0.5f,  0.0f,
    -0.5f, -0.5f,  0.0f,
    1.0f,  0.5f,  0.0f
  };
  unsigned short indis[] = {
    0,1,2,0,3,1
  };

  temp->add(4, 6, points, indis);
  temp->flush();

}
void REMVertexCacheManager::setVertexFormat(REMVertexFormat activeVertexFormat){
  _activeVertexFormat = activeVertexFormat;
}

unsigned int REMVertexCacheManager::getActiveCache(){
  return -1;
};
void REMVertexCacheManager::setActiveCache(unsigned int cID){

};
int REMVertexCacheManager::forcedFlushAll(){
  return 0;
};


bool REMVertexCache::usesSkin(unsigned int skinID){
  return (_skinID == skinID);
}
bool REMVertexCache::isEmpty() {
  if (_nNumVerts>0) return false;
  return true;
}
int REMVertexCache::numVerts() {
  return _nNumVerts;
}


REMVertexCache::REMVertexCache(unsigned int nVertsMax, unsigned int nIndisMax, unsigned int nStride, REMSkinManager* pSkinMan, REMVertexCacheManager *pVCM, unsigned int dwID){
  _pSkinMan = pSkinMan;
  _pVCM = pVCM;
  _nNumVertsMax = nVertsMax;
  _nNumIndisMax = nIndisMax;
  _nNumVerts = 0;
  _nNumIndis = 0;
  _dwID = dwID;
  _nStride = nStride;

  memset(&_skin, MAX_ID, sizeof(REMSkin));
  _skinID = MAX_ID;
  glGenBuffers(2, _pB);
  if(_pB[0] < 0 && _pB[1]<0){
    printf("Error creating buffers in Vertex Cache.\n");
    return;
  }

  glBindBuffer(GL_ARRAY_BUFFER, _pB[0]);
  glBufferData(GL_ARRAY_BUFFER, nVertsMax*nStride, NULL, GL_DYNAMIC_DRAW);

  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _pB[1]);
  glBufferData(GL_ELEMENT_ARRAY_BUFFER, nIndisMax*sizeof(unsigned short), NULL, GL_DYNAMIC_DRAW);

  _pVD =  (float*)malloc(nVertsMax*nStride);
  _pInD = (unsigned short*)malloc(nIndisMax*sizeof(unsigned short));
}

REMVertexCache::~REMVertexCache(){
  if(_pB[0] >= 0 && _pB[1] >= 0){
    glDeleteBuffers(2,_pB);
  }
  if(_pVD){
    free(_pVD);
    _pVD = NULL;
  }
  if(_pInD){
    free(_pInD);
    _pInD = NULL;
  }
}

void REMVertexCache::setSkin(unsigned int skinID){
  if(!usesSkin(skinID)){
    REMSkin tmpSkin = _pSkinMan->getSkin(skinID);
    REMSkin* pSkin = &tmpSkin;

    if(!isEmpty()) flush();

    memcpy(&_skin, pSkin, sizeof(REMSkin));
    _skinID = skinID;
    _pVCM->setActiveCache(MAX_ID);
  }
}

int REMVertexCache::add(unsigned int nVerts, unsigned int nIndis, const float* pVerts, const unsigned short* pIndices){
  int nSizeV = _nStride*nVerts;
  int nSizeI = sizeof(unsigned short)*nIndis;
  int nPosV;
  int nPosI;

  if(nVerts > _nNumVertsMax || nIndis > _nNumIndisMax) return REMFAIL;
  if((nVerts+_nNumVerts > _nNumVertsMax) || (nIndis+_nNumIndis > _nNumIndisMax)){
    if(flush() != REMOK) return REMFAIL;
  }

  if(_nNumVerts == 0){
    nPosV = nPosI = 0;
  } else {
    nPosV = _nStride*_nNumVerts;
    nPosI = sizeof(unsigned short)*_nNumIndis;
  }
  memcpy(_pVD+nPosV,pVerts,nSizeV);
  int nBase = _nNumVerts;
  if(!pIndices) nIndis = nVerts;

  for(int i=0;i<nIndis;i++){
    if(pIndices != NULL){
      _pInD[i+nPosI] = pIndices[i]+nBase;
    } else {
      _pInD[i+nPosI] = i + nBase;
    }
    _nNumIndis++;
  }
  _nNumVerts += nVerts;
  return REMOK;
}

int REMVertexCache::flush(){
  REMRenderState sm;
  int ret = REMFAIL;
  if(_nNumVerts <= 0) return REMOK;
  if(_pVCM->getActiveCache() != _dwID){
    glBindBuffer(GL_ARRAY_BUFFER, _pB[0]);
    glVertexAttribPointer(0, 3, GL_FLOAT, 0, 0, 0);
    glBufferSubData(GL_ARRAY_BUFFER,0,_nNumVerts*_nStride,_pVD);
    glEnableVertexAttribArray(0);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _pB[1]);
    glBufferSubData(GL_ELEMENT_ARRAY_BUFFER,0,_nNumIndis*sizeof(unsigned short),_pInD);
    _pVCM->setActiveCache(_dwID);
  }

  //skin and material stuff

  //rendeer
  glDrawElements(GL_TRIANGLES, _nNumIndis, GL_UNSIGNED_SHORT, (void*)0);
  _nNumVerts = 0;
  _nNumIndis = 0;
  return REMOK;
}
