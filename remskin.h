#ifndef REMSKIN_H
#define REMSKIN_H
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include "rem3d.h"
#include "remimage.h"
#include "const.h"

typedef unsigned int GLuint;

typedef struct REMMATERIAL_TYPE{
  REMColour cDiffuse;
  REMColour cAmbient;
  REMColour cSpecular;
  REMColour cEmissive;
  float fPower;
} REMMaterial;

typedef struct REMTEXTURE_TYPE{
  float fAlpha;
  char* chName;
  GLuint* pData;
  REMColour* pClrKeys;
  unsigned int dwNum;
} REMTexture;

typedef struct REMSKIN_TYPE{
  bool bAlpha;
  unsigned int nMaterial;
  unsigned int nTexture[8];
  int nOfTextures;
} REMSkin;

class REMSkinManager{
  friend class REMVertexCache;
protected:
  unsigned int _nNumSkins;
  unsigned int _nNumMaterials;
  unsigned int _nNumTextures;
  inline bool colourEqual(const REMColour* pCol0,const REMColour* pCol1);
  int createTexture(REMTexture* pTexture, bool bAlpha);
  int convertToNormalMap(REMTexture* pTexture);
  int setAlphaKey(GLuint* pTex,unsigned char R,unsigned char G,unsigned char B,unsigned char A);
  int setTransparency(GLuint* pTex,unsigned char A);
  void log(char*,...);
public:
  REMSkin* _pSkins;
  REMMaterial* _pMaterials;
  REMTexture* _pTextures;
  REMSkinManager();
  ~REMSkinManager();
  int addSkin(const REMColour* pcAmbient,const REMColour* pcDiffuse,const REMColour* pcEmissive,const REMColour* pcSpecular, float fSpecPower, unsigned int* nSkinID);
  int addTexture(unsigned int nSkinID, const char *chName, bool bAlpha, float fAlpha, REMColour* cColourKeys, unsigned int dwNumColourKeys);
  int addTextureHeightmapAsBump(unsigned int nSkinID, const char* chName);
  bool materialEqual(const REMMaterial* pMat0, const REMMaterial* pMat1);
  REMSkin getSkin(unsigned int nSkinID);
  REMMaterial getMaterial(unsigned int nMatID);
  const char* getTextureName(unsigned int nTexID, float* pfAlpha, REMColour* pAK, unsigned char* pNum);
  void logCurrentStatus(char* chLog, bool bDetail);
};

#endif
