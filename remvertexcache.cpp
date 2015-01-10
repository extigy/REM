#include "remvertexcache.h"
#include "remrender.h"
#include "remshader.h"
#include <GLES2/gl2.h>
REMVertexCacheManager::REMVertexCacheManager(REMRenderDevice* r, unsigned int nMaxVerts, unsigned int nMaxIndis){
  _renderDevice = r;
  unsigned short dwID=1;
  int i=0;
  _pB = NULL;
  _nNumB = NULL;
  _dwActiveCache = MAX_ID;
  _dwActiveB = MAX_ID;

  for(i=0;i<NUM_CACHES;i++){
    _cacheUU[i] = new REMVertexCache(UU_VERTEX,nMaxVerts,nMaxIndis,sizeof(REMUUVertex),r->getSkinManager(),this,dwID++);
    _cacheUL[i] = new REMVertexCache(UL_VERTEX,nMaxVerts,nMaxIndis,sizeof(REMULVertex),r->getSkinManager(),this,dwID++);
  }
}

REMVertexCacheManager::~REMVertexCacheManager(){
  unsigned int n=0;
  int i=0;
  if(_pB){
    for (n=0;n<_nNumB;n++){
      if(_pB[n].pVB>-1){
        glDeleteBuffers(1,&_pB[n].pVB);
      }
      if(_pB[n].pIB>-1){
        glDeleteBuffers(1,&_pB[n].pIB);
      }
    }
    free(_pB);
  }

  for(i=0;i<NUM_CACHES;i++){
    if(_cacheUU[i]){
      delete _cacheUU[i];
      _cacheUU[i]=NULL;
    }
    if(_cacheUL[i]){
      delete _cacheUL[i];
      _cacheUL[i]=NULL;
    }
  }
}

int REMVertexCacheManager::render(REMVertexFormat vertexFormat, unsigned int skinID, unsigned int nVerts, unsigned int nIndis, void* pVerts, const unsigned short* pIndis){
  REMVertexCache** pCache=NULL;
  REMVertexCache* pCacheEmpty=NULL;
  REMVertexCache* pCacheFullest=NULL;
  int nEmptyVC = -1;
  int nFullestVC = 0;

  switch(vertexFormat){
    case UU_VERTEX:
      pCache = _cacheUU;
      break;
    case UL_VERTEX:
      pCache = _cacheUL;
      break;
    default:
      return REMFAIL;
  }

  _dwActiveB = MAX_ID;

  for(int i=0; i<NUM_CACHES;i++){
    if(pCache[i]->usesSkin(skinID)) return pCache[i]->add(nVerts,nIndis,pVerts,pIndis);
    if(pCache[i]->isEmpty()) pCacheEmpty = pCache[i];
    if(pCache[i]->numVerts() > pCacheFullest->numVerts()) pCacheFullest = pCache[i];
  }

  if(pCacheEmpty){
    pCacheEmpty->setSkin(skinID);
    return pCacheEmpty->add(nVerts,nIndis,pVerts,pIndis);
  }

  pCacheFullest->flush();
  pCacheFullest->setSkin(skinID);
  return pCacheFullest->add(nVerts,nIndis,pVerts,pIndis);
}

void REMVertexCacheManager::setVertexFormat(REMVertexFormat activeVertexFormat){
  _activeVertexFormat = activeVertexFormat;
}

unsigned int REMVertexCacheManager::getActiveCache(){
  return _dwActiveCache;
};
void REMVertexCacheManager::setActiveCache(unsigned int cID){
  _dwActiveCache = cID;
};
int REMVertexCacheManager::forcedFlush(REMVertexFormat vertexFormat){
  REMVertexCache **pCache=NULL;
  int i=0;

  switch(vertexFormat){
    case UU_VERTEX:
    pCache = _cacheUU;
    break;
    case UL_VERTEX:
    pCache = _cacheUL;
    break;
    default:
    return REMFAIL;
  }

  for(i=0;i<NUM_CACHES;i++){
    if(!pCache[i]->isEmpty())
      if(pCache[i]->flush() < 0) return REMFAIL;
  }
  return REMOK;
};

int REMVertexCacheManager::forcedFlushAll(){
  int i;

  for(i=0;i<NUM_CACHES;i++){
    if(_cacheUU[i] && !_cacheUU[i]->isEmpty()){
      if(_cacheUU[i]->flush() < 0) return REMFAIL;
    }
  }
  for(i=0;i<NUM_CACHES;i++){
    if(_cacheUL[i] && !_cacheUL[i]->isEmpty()){
      if(_cacheUL[i]->flush() < 0) return REMFAIL;
    }
  }
  return REMOK;
};
REMRenderDevice* REMVertexCacheManager::getRenderDevice(){
  return _renderDevice;
}
int REMVertexCacheManager::createBuffer(REMVertexFormat vertexFormat, unsigned int nSkinID, unsigned int nVerts, unsigned int nIndis, void* pVerts, const unsigned short* pIndis, unsigned int *pnID){
  int hr;
  void *pData;

  if(_nNumB >= (MAX_ID-1)) return REMOUTOFMEMORY;

  if((_nNumB%50)==0){
    int n = (_nNumB+50)*sizeof(REMBuffer);
    _pB = (REMBuffer*)realloc(_pB,n);
    if(!_pB) return REMOUTOFMEMORY;
  }

  _pB[_nNumB].nNumVerts = nVerts;
  _pB[_nNumB].nNumIndis = nIndis;
  _pB[_nNumB].nSkinID = nSkinID;

  switch(vertexFormat){
    case UU_VERTEX:
    _pB[_nNumB].nStride = sizeof(REMUUVertex);
    break;
    case UL_VERTEX:
    _pB[_nNumB].nStride = sizeof(REMULVertex);
    break;
    default:
    return REMFAIL;
  }

  if (nIndis > 0){
    _pB[_nNumB].bIndis = true;
    _pB[_nNumB].nNumTris = int(nIndis/3.0f);
    glGenBuffers(1, &_pB[_nNumB].pIB);
    _pB[_nNumB].pID = (unsigned short*)malloc(nIndis*sizeof(unsigned short));

  } else {
    _pB[_nNumB].bIndis = false;
    _pB[_nNumB].nNumTris = int(nVerts/3.0f);
    _pB[_nNumB].pIB = -1;
  }

  glGenBuffers(1, &_pB[_nNumB].pVB);
  _pB[_nNumB].pVD = malloc(nVerts*_pB[_nNumB].nStride);

  (*pnID) = _nNumB;
  _nNumB++;
  return REMOK;
}

int REMVertexCacheManager::render(unsigned int nID){
  int hr = REMOK;
  REMRenderState sm = _renderDevice->getShadeMode();

  _dwActiveCache = MAX_ID;

  if(_dwActiveB != nID){
    if(_pB[nID].bIndis){
      glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _pB[nID].pIB);
      glBufferData(GL_ELEMENT_ARRAY_BUFFER, _pB[nID].nNumIndis*sizeof(unsigned short), _pB[nID].pID, GL_STATIC_DRAW);
    }
    glBindBuffer(GL_ARRAY_BUFFER, _pB[nID].pVB);
    glBufferData(GL_ARRAY_BUFFER, _pB[nID].nNumVerts*_pB[nID].nStride, _pB[nID].pVD, GL_STATIC_DRAW);
  }

  if(_renderDevice->getActiveSkinID() != _pB[nID].nSkinID){

    REMSkin *pSkin = &(_renderDevice->getSkinManager()->_pSkins[_pB[nID].nSkinID]);

    if(sm != RS_SHADE_TRIWIRE){
      REMColour cMat;
      REMMaterial *pMat = &(_renderDevice->getSkinManager()->_pMaterials[pSkin->nMaterial]);
      cMat = pMat->cDiffuse;
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matDiffuse"),1,cMat.c);
      cMat = pMat->cAmbient;
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matAmbient"),1,cMat.c);
      cMat = pMat->cSpecular;
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matSpecular"),1,cMat.c);
      cMat = pMat->cEmissive;
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matEmissive"),1,cMat.c);
      glUniform1f(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matPower"),pMat->fPower);

      for(int i=0;i<8;i++){
        if(pSkin->nTexture[i] != MAX_ID){
          unsigned int* pTex = NULL;
          pTex = _renderDevice->getSkinManager()->_pTextures[pSkin->nTexture[i]].pData;
          glActiveTexture(0x84C0+i);
          glBindTexture(GL_TEXTURE_2D, *pTex);
        } else break;
      }
    } else {
      REMColour clrWire = _renderDevice->_clrWire;
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matDiffuse"),1,clrWire.c);
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matAmbient"),1,clrWire.c);
      clrWire.fR = 0.0f;clrWire.fG = 0.0f;clrWire.fB = 0.0f;clrWire.fA = 1.0f;
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matSpecular"),1,clrWire.c);
      glUniform4fv(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matEmissive"),1,clrWire.c);
      glUniform1f(glGetUniformLocation(_renderDevice->getShaderManager()->getActiveProgram(), "matPower"),1.0f);

      glActiveTexture(0x84C0);
      glBindTexture(GL_TEXTURE_2D, 0);
    }

    //TODO: ALTERNATIVE BLENDING FCNS
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    _renderDevice->setActiveSkinID(_pB[nID].nSkinID);
  }

  if(_pB[nID].bIndis){
    if(sm == RS_SHADE_POINTS){
      glDrawElements(GL_POINTS, _pB[nID].nNumIndis, GL_UNSIGNED_SHORT, (void*)0);
    } else if (sm == RS_SHADE_HULLWIRE){
      glDrawElements(GL_LINE_STRIP, _pB[nID].nNumIndis, GL_UNSIGNED_SHORT, (void*)0);
    } else if (sm == RS_SHADE_SOLID){
      glDrawElements(GL_TRIANGLES, _pB[nID].nNumIndis, GL_UNSIGNED_SHORT, (void*)0);
    } else if (sm == RS_SHADE_TRIWIRE){
      glDrawElements(GL_TRIANGLES, _pB[nID].nNumTris, GL_UNSIGNED_SHORT, (void*)0);
    }
  } else {
    if(sm == RS_SHADE_POINTS){
      glDrawArrays(GL_POINTS, 0, _pB[nID].nNumVerts);
    } else if (sm == RS_SHADE_HULLWIRE){
      glDrawArrays(GL_LINE_STRIP,0, _pB[nID].nNumVerts);
    } else if (sm == RS_SHADE_SOLID){
      glDrawArrays(GL_TRIANGLES,0, _pB[nID].nNumVerts);
    } else if (sm == RS_SHADE_TRIWIRE){
      glDrawArrays(GL_TRIANGLES,0, _pB[nID].nNumTris);
    }
  }
  return hr;
}

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


REMVertexCache::REMVertexCache(REMVertexFormat vertexFormat,unsigned int nVertsMax, unsigned int nIndisMax, unsigned int nStride, REMSkinManager* pSkinMan, REMVertexCacheManager *pVCM, unsigned int dwID){
  _pSkinMan = pSkinMan;
  _vertexFormat = vertexFormat;
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

  _pVD =  malloc(nVertsMax*nStride);
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

int REMVertexCache::add(unsigned int nVerts, unsigned int nIndis, void* pVerts, const unsigned short* pIndices){
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
  memcpy((char*)_pVD+nPosV,pVerts,nSizeV);
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
    switch(_vertexFormat){
      case UU_VERTEX:
        glVertexAttribPointer(0, 4, GL_FLOAT, 0, sizeof(REMUUVertex), (const void*)0);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(1, 4, GL_FLOAT, 0, sizeof(REMUUVertex), (const void*)(4*sizeof(float)));
        glEnableVertexAttribArray(1);
        glVertexAttribPointer(2, 2, GL_UNSIGNED_SHORT, 0, sizeof(REMUUVertex), (const void*)(8*sizeof(float)));
        glEnableVertexAttribArray(2);
      break;
      case UL_VERTEX:
        glVertexAttribPointer(0, 4, GL_FLOAT, 0,sizeof(REMULVertex), (const void*)0);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(1, 4, GL_FLOAT, 0, sizeof(REMULVertex), (const void*)(4*sizeof(float)));
        glEnableVertexAttribArray(1);
        glVertexAttribPointer(2, 2, GL_UNSIGNED_SHORT, 0, sizeof(REMULVertex), (const void*)(8*sizeof(float)));
        glEnableVertexAttribArray(2);
      break;
      default:
      return REMFAIL;
    }
    glBufferSubData(GL_ARRAY_BUFFER,0,_nNumVerts*_nStride,_pVD);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _pB[1]);
    glBufferSubData(GL_ELEMENT_ARRAY_BUFFER,0,_nNumIndis*sizeof(unsigned short),_pInD);
    _pVCM->setActiveCache(_dwID);
  }

  if(_pVCM->getRenderDevice()->getActiveSkinID() != _skinID){
    unsigned int* pTex = NULL;
    REMMaterial *pMat = &(_pSkinMan->_pMaterials[_skin.nMaterial]);
    if(_pVCM->getRenderDevice()->getShadeMode()!=RS_SHADE_TRIWIRE){
      REMColour cMat;
      cMat = pMat->cDiffuse;
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matDiffuse"),1,cMat.c);
      cMat = pMat->cAmbient;
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matAmbient"),1,cMat.c);
      cMat = pMat->cSpecular;
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matSpecular"),1,cMat.c);
      cMat = pMat->cEmissive;
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matEmissive"),1,cMat.c);
      glUniform1f(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matPower"),pMat->fPower);
      for(int i=0;i<8;i++){
        if(_skin.nTexture[i] != MAX_ID){
          pTex = _pSkinMan->_pTextures[_skin.nTexture[i]].pData;
          glActiveTexture(0x84C0+i);
          glBindTexture(GL_TEXTURE_2D, *pTex);
        } else break;
      }
    } else {
      REMColour clrWire = _pVCM->getRenderDevice()->_clrWire;
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matDiffuse"),1,clrWire.c);
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matAmbient"),1,clrWire.c);
      clrWire.fR = 0.0f;clrWire.fG = 0.0f;clrWire.fB = 0.0f;clrWire.fA = 1.0f;
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matSpecular"),1,clrWire.c);
      glUniform4fv(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matEmissive"),1,clrWire.c);
      glUniform1f(glGetUniformLocation(_pVCM->getRenderDevice()->getShaderManager()->getActiveProgram(), "matPower"),1.0f);

      glActiveTexture(0x84C0);
      glBindTexture(GL_TEXTURE_2D, 0);
    }

    //TODO: ALTERNATIVE BLENDING FCNS
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    _pVCM->getRenderDevice()->setActiveSkinID(_skinID);
  }

  sm = _pVCM->getRenderDevice()->getShadeMode();

  if(sm == RS_SHADE_POINTS){
    glDrawElements(GL_POINTS, _nNumIndis, GL_UNSIGNED_SHORT, (void*)0);
  } else if (sm == RS_SHADE_HULLWIRE){
    glDrawElements(GL_LINE_STRIP, _nNumIndis, GL_UNSIGNED_SHORT, (void*)0);
  } else if (sm == RS_SHADE_SOLID){
    glDrawElements(GL_TRIANGLES, _nNumIndis, GL_UNSIGNED_SHORT, (void*)0);
  } else if (sm == RS_SHADE_TRIWIRE){
    glDrawElements(GL_TRIANGLES, _nNumIndis/3, GL_UNSIGNED_SHORT, (void*)0);
  }

  _nNumVerts = 0;
  _nNumIndis = 0;
  return REMOK;
}
