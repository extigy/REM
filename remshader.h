#ifndef REMSHADER_H
#define REMSHADER_H
#include "const.h"

typedef unsigned int GLuint;
class REMRenderDevice;
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
