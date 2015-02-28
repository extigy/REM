#ifndef REMSIMPLEMODEL_H
#define REMSIMPLEMODEL_H
#include "remrender.h"
#include <string>
#include <iostream>
#include <fstream>

#define INT_V_POS 0
#define INT_V_NOR 1
#define INT_V_TEX 2
#define INT_MTL 4
#define INT_FACE 3
#define MTL_NS 5
#define MTL_D 6
#define MTL_ILLUM 7
#define MTL_KA 8
#define MTL_KD 9
#define MTL_KS 10
#define MTL_KE 11
#define MTL_MAP_KA 12
#define MTL_MAP_KD 13

#define MAX_LINE_LENGTH 1024

typedef struct OBJ_3V_TYPE {
  float p[3];
} obj3V;

typedef struct OBJ_2V_TYPE {
  float p[2];
} obj2V;



class REMSimpleModel{
protected:
  REMRenderDevice* _pDevice;

  unsigned int _nMaxObjV;
  obj3V* _pObjVertex;
  unsigned int _nNumObjVertex;
  obj2V* _pObjTexCoord;
  unsigned int _nNumObjTexCoord;
  obj3V* _pObjNormal;
  unsigned int _nNumObjNormal;

  char _kaFilename[1024];
  char _kdFilename[1024];

  REMColour _cAmbient;
  REMColour _cDiffuse;
  REMColour _cEmissive;
  REMColour _cSpecular;
  float _fSpecPower;
  float _alpha;

  FILE* _pObjFile;
  FILE* _pMTLFile;
  bool _bReady;
  bool _bTex;
  bool _bDetailTex;
  char _pChunk[MAX_LINE_LENGTH];
  char _pMTLChunk[MAX_LINE_LENGTH];
  int getObjNextChunk();
  int getMTLNextChunk();
  void readObjVertex();
  void readObjNormal();
  void readObjTexCoord();
  void readObjFace();
  void handleMTL();
  void setupObjCache();
  void setupVertexArrays();
  void cleanupObjCache();
  void setupMTL();
  void log(char* chString,...);
  int getNumberOfLinesInFile();
  int getNumberOfFacesInFile();
public:
  REMVertexFormat _vFormat;
  unsigned int _nSkin;
  unsigned int _nNumVertices;
  void* _pVertices;
  unsigned int _nNumIndices;
  unsigned short* _pIndices;
  REMSimpleModel(REMRenderDevice* pDevice,REMVertexFormat);
  void readFile(const char *chFile);
  ~REMSimpleModel();

  int render();

};

#endif
