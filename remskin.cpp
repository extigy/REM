#include "remskin.h"
#include "const.h"
#include <GLES2/gl2.h>

REMSkinManager::REMSkinManager(){
  log("Initialising...");
  _nNumMaterials = 0;
  _nNumTextures = 0;
  _nNumSkins = 0;
  _pMaterials = NULL;
  _pTextures = NULL;
  _pSkins = NULL;
  log("Initialised.");
}

REMSkinManager::~REMSkinManager(){
  log("Deinitialising...");
  if(_pTextures){
    for(int i=0;i<_nNumTextures;i++){
      if(_pTextures[i].texInt > 0){
        glDeleteTextures(1,&(_pTextures[i].texInt));
        log("Deleted Texture %d",_pTextures[i].texInt);
        _pTextures[i].texInt = 0;
      }

      if(_pTextures[i].pClrKeys){
        delete [] _pTextures[i].pClrKeys;
        _pTextures[i].pClrKeys = NULL;
      }
      if(_pTextures[i].chName){
        delete [] _pTextures[i].chName;
        _pTextures[i].chName = NULL;
      }
    }
    free (_pTextures);
    _pTextures = NULL;
  }

  if(_pMaterials){
    free(_pMaterials);
    _pMaterials = NULL;
  }

  if(_pSkins){
    free(_pSkins);
    _pSkins = NULL;
  }

  log("Deinitialised OK.");
}

inline bool REMSkinManager::colourEqual(const REMColour* pCol0,const REMColour* pCol1){
  if((pCol0->fA!=pCol1->fA) ||
     (pCol0->fR!=pCol1->fR) ||
     (pCol0->fG!=pCol1->fG) ||
     (pCol0->fB!=pCol1->fB)) return false;

  return true;
}

bool REMSkinManager::materialEqual(const REMMaterial* pMat0, const REMMaterial* pMat1){
  if(!colourEqual(&pMat0->cAmbient, &pMat1->cAmbient)
  || !colourEqual(&pMat0->cDiffuse, &pMat1->cDiffuse)
  || !colourEqual(&pMat0->cEmissive, &pMat1->cEmissive)
  || !colourEqual(&pMat0->cSpecular, &pMat1->cSpecular)
  || (pMat0->fPower != pMat1->fPower)) return false;

  return true;
}

REMSkin REMSkinManager::getSkin(unsigned int nSkinID){
  if(nSkinID < _nNumSkins){
    return _pSkins[nSkinID];
  } else {
    REMSkin emptySkin;
    return emptySkin;
  }
}

REMMaterial REMSkinManager::getMaterial(unsigned int nMatID){
  if(nMatID<_nNumMaterials){
    return _pMaterials[nMatID];
  } else {
    REMMaterial emptyMaterial;
    return emptyMaterial;
  }
}

const char* REMSkinManager::getTextureName(unsigned int nID, float* pfAlpha, REMColour* pAK, unsigned char* pNum){
  if(nID >= _nNumTextures) return NULL;
  if(pfAlpha) *pfAlpha = _pTextures[nID].fAlpha;
  if(pNum) *pNum = _pTextures[nID].dwNum;

  if(_pTextures[nID].pClrKeys && pAK){
    memcpy(pAK,_pTextures[nID].pClrKeys, sizeof(REMColour)*_pTextures[nID].dwNum);
  }

  return _pTextures[nID].chName;
}


int REMSkinManager::addSkin(const REMColour* pcAmbient, const REMColour* pcDiffuse, const REMColour* pcSpecular, const REMColour* pcEmissive, float fSpecPower, unsigned int* nSkinID){
  unsigned int nMat, n;
  bool bMat = false;

  if(_nNumSkins%50 == 0) {
    n = (_nNumSkins+50)*sizeof(REMSkin);
    _pSkins = (REMSkin*)realloc(_pSkins, n);
    if(!_pSkins) return REMOUTOFMEMORY;
  }

  REMMaterial mat;
  mat.cAmbient = *pcAmbient;
  mat.cDiffuse = *pcDiffuse;
  mat.cEmissive = *pcEmissive;
  mat.cSpecular = *pcSpecular;
  mat.fPower = fSpecPower;

  for (nMat=0;nMat<_nNumMaterials;nMat++){
    if(materialEqual(&mat,&_pMaterials[nMat])){
      bMat = true;
      break;
    }
  }

  if(bMat){
    _pSkins[_nNumSkins].nMaterial = nMat;
  } else {
    _pSkins[_nNumSkins].nMaterial = _nNumMaterials;

    if(_nNumMaterials%50 == 0) {
      n = (_nNumMaterials+50)*sizeof(REMMaterial);
      _pMaterials = (REMMaterial*)realloc(_pMaterials, n);
      if(!_pMaterials) return REMOUTOFMEMORY;
    }

    memcpy(&_pMaterials[_nNumMaterials],&mat,sizeof(REMMaterial));
    _nNumMaterials++;
  }

  _pSkins[_nNumSkins].bAlpha = false;
  for(int i=0;i<8;i++) _pSkins[_nNumSkins].nTexture[i] = MAX_ID;
  (*nSkinID) = _nNumSkins;
  log("Created new skin with ID: %d.", _nNumSkins);
  _nNumSkins++;
  return REMOK;
}
int REMSkinManager::addTexture(unsigned int nSkinID, const char *chName, bool bAlpha, float fAlpha, REMColour* cColourKeys, unsigned int dwNumColourKeys){
  REMTexture* pREMTex = NULL;
  int hr;
  unsigned int nTex, n;
  bool bTex = false;

  if(nSkinID >= _nNumSkins) return REMINVALIDID;

  if(_pSkins[nSkinID].nTexture[7] != MAX_ID){
    log("ERROR: addTexture() failed: All 8 textures filled.");
    return REMTEXTURESFULL;
  };

  for(nTex=0;nTex<_nNumTextures;nTex++){
    if(strcmp(chName,_pTextures[nTex].chName)==0){
      bTex=true;
      break;
    }
  }

  if(!bTex){
    if((_nNumTextures%50)==0){
      n=(_nNumTextures+50)*sizeof(REMTexture);
      _pTextures = (REMTexture*)realloc(_pTextures,n);
      if (!_pTextures) return REMOUTOFMEMORY;
    }

    if (bAlpha){
      _pSkins[nSkinID].bAlpha = true;
      _pTextures[_nNumTextures].fAlpha = fAlpha;
    } else {
      _pTextures[_nNumTextures].fAlpha = 1.0f;
    }

    _pTextures[_nNumTextures].pClrKeys = NULL;
    _pTextures[_nNumTextures].chName = new char[strlen(chName)+1];
    memcpy(_pTextures[_nNumTextures].chName, chName, strlen(chName)+1);
    _pTextures[_nNumTextures].dwNum = dwNumColourKeys;
    if(dwNumColourKeys>0){
      _pTextures[_nNumTextures].pClrKeys = new REMColour[dwNumColourKeys];
      memcpy(_pTextures[_nNumTextures].pClrKeys,cColourKeys,sizeof(REMColour)*dwNumColourKeys);
    }
    hr = createTexture(&_pTextures[_nNumTextures], false);
    if (hr<0) return hr;

    nTex = _nNumTextures;
    _nNumTextures++;

    for(int i=0; i<8; i++){
      if(_pSkins[nSkinID].nTexture[i] == MAX_ID){
        _pSkins[nSkinID].nTexture[i] = nTex;
        _pSkins[nSkinID].nOfTextures = i+1;
        break;
      }
    }
    return REMOK;
  }
}


int REMSkinManager::addTextureHeightmapAsBump(unsigned int nSkinID, const char *chName){
  REMTexture* pREMTex = NULL;
  int hr;
  unsigned int nTex, n;
  bool bTex = false;

  if(nSkinID >= _nNumSkins) return REMINVALIDID;

  if(_pSkins[nSkinID].nTexture[7] != MAX_ID){
    log("ERROR: addTexture() failed: All 8 textures filled.");
    return REMTEXTURESFULL;
  };

  for(nTex=0;nTex<_nNumTextures;nTex++){
    if(strcmp(chName,_pTextures[nTex].chName)==0){
      bTex=true;
      break;
    }
  }

  if(!bTex){
    if((_nNumTextures%50)==0){
      n=(_nNumTextures+50)*sizeof(REMTexture);
      _pTextures = (REMTexture*)realloc(_pTextures,n);
      if (!_pTextures) return REMOUTOFMEMORY;
    }

    _pTextures[_nNumTextures].fAlpha = 1.0f;
    _pTextures[_nNumTextures].pClrKeys = NULL;
    _pTextures[_nNumTextures].dwNum = 0;

    _pTextures[_nNumTextures].chName = new char[strlen(chName)+1];
    memcpy(_pTextures[_nNumTextures].chName, chName, strlen(chName)+1);
    hr = createTexture(&_pTextures[_nNumTextures], true);
    if (hr<0) return hr;

    hr = convertToNormalMap(&_pTextures[_nNumTextures]);
    if(hr<0) return hr;

    nTex = _nNumTextures;
    _nNumTextures++;
  }

  for(int i=0; i<8; i++){
    if(_pSkins[nSkinID].nTexture[i] == MAX_ID){
      _pSkins[nSkinID].nTexture[i] = nTex;
      _pSkins[nSkinID].nOfTextures = i+1;
      break;
    }
  }
  return REMOK;
}

int REMSkinManager::createTexture(REMTexture* pTexture, bool bAlpha){
  int hr;
  REMRawImage* rI = rawImageFromBMP(pTexture->chName);

  if(bAlpha){
    for(unsigned int dw=0;dw<pTexture->dwNum;dw++){
      hr = setAlphaKeyRaw(rI,(unsigned char)(pTexture->pClrKeys[dw].fR*255),(unsigned char)(pTexture->pClrKeys[dw].fG*255),(unsigned char)(pTexture->pClrKeys[dw].fB*255),(unsigned char)(pTexture->pClrKeys[dw].fA*255));
      if(hr<0) return hr;
    }
    if (pTexture->fAlpha < 1.0f){
      setAlphaRaw(rI,(unsigned char)(pTexture->fAlpha*255));
      if(hr<0) return hr;
    }
  }


  GLuint texID;
  glGenTextures(1, &texID);
  if(texID == 0){
    return REMGLGENTEXTUREERROR;
  }
  glBindTexture(GL_TEXTURE_2D, texID);
  glTexImage2D(GL_TEXTURE_2D, 0, rI->format, rI->width, rI->height, 0, GL_RGBA, rI->type, rI->pData);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
  glGenerateMipmap(GL_TEXTURE_2D);
  glBindTexture(GL_TEXTURE_2D, 0);

  pTexture->texInt = texID;
  log("Created glTexture with ID: %d",pTexture->texInt);
  if(pTexture->texInt == 0) return REMOUTOFMEMORY;
  //releaseRawImage(rI);
  return REMOK;
}

void REMSkinManager::log(char* chString,...){
  va_list args;
  va_start(args, chString);
  printf("[SkinManager]: ");
  vprintf(chString, args);
  printf("\n");
  va_end(args);
}
