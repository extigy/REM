#include "remshader.h"
#include "remrender.h"
#include <GLES2/gl2.h>
REMShaderManager::REMShaderManager(REMRenderDevice* renderDevice){
  _renderDevice =  renderDevice;
}

int REMShaderManager::createVShader(const char *pData, bool bLoadFromFile,REMVertexFormat vertexFormat, unsigned int* pID){
  char* vs_source;
  long fSize;
  GLint compile_ok = GL_FALSE;
  GLint infoLen = 0;

  if(_nNumVShaders >= (MAX_ID-1)) return REMOUTOFMEMORY;

  if(bLoadFromFile){
    FILE* VSFile = fopen(pData, "r");
    if(!VSFile) return REMFAIL;

    fseek(VSFile, 0L , SEEK_END);
    fSize = ftell(VSFile);
    rewind(VSFile);

    vs_source = (char*)calloc(1,fSize+1);
    if(!vs_source){
      fclose(VSFile);
      return REMOUTOFMEMORY;
    }

    if(fread(vs_source, fSize, 1, VSFile) != 1){
      free(vs_source);
      return REMFAIL;
    }
    fclose(VSFile);
  } else {
    vs_source = (char*)pData;
  }

  GLuint vs = glCreateShader (GL_VERTEX_SHADER);
  glShaderSource (vs, 1, (const char**)&vs_source, NULL);
  glCompileShader (vs);
  glGetShaderiv(vs, GL_COMPILE_STATUS, &compile_ok);
  if (!compile_ok){
    glGetShaderiv ( vs, GL_INFO_LOG_LENGTH, &infoLen );
    if ( infoLen > 1 ){
      char* infoLog = (char*)malloc (sizeof(char) * infoLen );
      glGetShaderInfoLog ( vs, infoLen, NULL, infoLog );
      printf( "Error compiling shader:\n%s\n", infoLog );
      free ( infoLog );
    }
  }

  if(bLoadFromFile){
    free(vs_source);
  }

  _pVertexFormat[_nNumVShaders] = vertexFormat;
  _pVShader[_nNumVShaders] = vs;

  if(pID){
    (*pID) = _nNumVShaders;
  }

  printf( "Created Vertex Shader with ID: %d\n", _nNumVShaders );
  _nNumVShaders++;
  return REMOK;
}

int REMShaderManager::createFShader(const char *pData, bool bLoadFromFile, unsigned int* pID){
  char* fs_source;
  long fSize;
  GLint compile_ok = GL_FALSE;
  GLint infoLen = 0;

  if(_nNumFShaders >= (MAX_ID-1)) return REMOUTOFMEMORY;

  if(bLoadFromFile){
    FILE* FSFile = fopen(pData, "r");
    if(!FSFile) return REMFAIL;

    fseek(FSFile, 0L , SEEK_END);
    fSize = ftell(FSFile);
    rewind(FSFile);

    fs_source = (char*)calloc(1,fSize+1);
    if(!fs_source){
      fclose(FSFile);
      return REMOUTOFMEMORY;
    }

    if(fread(fs_source, fSize, 1, FSFile) != 1){
      free(fs_source);
      return REMFAIL;
    }
    fclose(FSFile);
  } else {
    fs_source = (char*)pData;
  }

  GLuint fs = glCreateShader (GL_FRAGMENT_SHADER);
  glShaderSource (fs, 1, (const char**)&fs_source, NULL);
  glCompileShader (fs);
  glGetShaderiv(fs, GL_COMPILE_STATUS, &compile_ok);
  if (!compile_ok){
    glGetShaderiv ( fs, GL_INFO_LOG_LENGTH, &infoLen );
    if ( infoLen > 1 ){
      char* infoLog = (char*)malloc (sizeof(char) * infoLen );
      glGetShaderInfoLog ( fs, infoLen, NULL, infoLog );
      printf( "Error compiling shader:\n%s\n", infoLog );
      free ( infoLog );
    }
  }

  if(bLoadFromFile){
    free(fs_source);
  }

  _pFShader[_nNumFShaders] = fs;

  if(pID){
    (*pID) = _nNumFShaders;
  }

  printf( "Created Fragment Shader with ID: %d\n", _nNumFShaders );
  _nNumFShaders++;
  return REMOK;
}

int REMShaderManager::createProgram(unsigned int vID, unsigned int fID, unsigned int* pID){
  GLuint shader_programme = glCreateProgram ();
  glAttachShader (shader_programme, _pFShader[fID]);
  glAttachShader (shader_programme, _pVShader[vID]);
  glLinkProgram (shader_programme);
  _pProgram[_nNumPrograms] = shader_programme;
  if(pID){
    (*pID) = _nNumPrograms;
  }
  printf("Created Shader programme: %d\n",_nNumPrograms);
  _pVertexFormatProgram[_nNumPrograms] = _pVertexFormat[vID];
  _nNumPrograms++;
  return REMOK;
}

int REMShaderManager::activateProgram(unsigned int pID){
  if (pID >= _nNumPrograms) return REMFAIL;
  _renderDevice->getVertexManager()->forcedFlushAll();
  glUseProgram(_pProgram[pID]);
  _activeProgram = _pProgram[pID];

  REMColour cMat;
  cMat.fR = 1.0f;
  cMat.fG = 1.0f;
  cMat.fB = 1.0f;
  cMat.fA = 1.0f;
  glUniform4fv(glGetUniformLocation(_pProgram[pID], "matDiffuse"),1,cMat.c);
  glUniform4fv(glGetUniformLocation(_pProgram[pID], "matAmbient"),1,cMat.c);
  glUniform4fv(glGetUniformLocation(_pProgram[pID], "matSpecular"),1,cMat.c);
  glUniform4fv(glGetUniformLocation(_pProgram[pID], "matEmissive"),1,cMat.c);
  glUniform1f(glGetUniformLocation(_pProgram[pID], "matPower"),1.0f);
  printf("Activated Shader Program: %d.\n",pID);
  return REMOK;
}

GLuint REMShaderManager::getActiveProgram(){
  return(_activeProgram);
}
