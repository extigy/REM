#ifndef REMSIMPLEMODEL_H
#define REMSIMPLEMODEL_H
#include "remrender.h"
#include <string>
#include <iostream>
#include <fstream>

#define INT_V_POS 0
#define INT_V_NOR 1
#define INT_V_TEX 2
#define INT_FACE 3
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

  FILE* _pFile;
  char* _pFileName;
  bool _bReady;
  char _pChunk[MAX_LINE_LENGTH];
  int getNextChunk();
  void readObjVertex();
  void readObjNormal();
  void readObjTexCoord();
  void readObjFace();
  void setupObjCache();
  void setupVertexArrays();
  void cleanupObjCache();
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
