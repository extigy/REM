#ifndef REMSHADER_H
#define REMSHADER_H
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "const.h"

typedef unsigned int GLuint;

typedef enum REMVERTEX_TYPE{
  UU_VERTEX,
  UL_VERTEX
} REMVertexFormat;

typedef struct UU_VERTEX_TYPE {
  float vcP[4]; //position
  float vcN[4]; //normal
  unsigned short vcT[2]; //texture
} REMUUVertex;

typedef struct UL_VERTEX_TYPE {
  float vcP[4]; //position
  float vcC[4]; //colour
  unsigned short vcT[2]; //texture
} REMULVertex;

class REMShaderManager{
private:
  GLuint          _pVShader[MAX_ID];
  REMVertexFormat _pVertexFormat[MAX_ID];
  GLuint          _pFShader[MAX_ID];
  GLuint          _pProgram[MAX_ID];
  unsigned int _nNumVShaders;
  unsigned int _nNumFShaders;
  unsigned int _nNumPrograms;
  REMVertexFormat _activeVertexType;
  GLuint _activeProgram;
public:
  REMShaderManager();
  int createVShader(const char *pData, bool bLoadFromFile, REMVertexFormat vertexFormat, unsigned int* pID);
  int createFShader(const char *pData, bool bLoadFromFile, unsigned int* pID);
  int createProgram(unsigned int vID, unsigned int fID, unsigned int* pID);
  int activateProgram(unsigned int pID);
  GLuint getActiveProgram();
};
#endif
