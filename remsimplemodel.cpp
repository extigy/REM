#include "remsimplemodel.h"
#include "const.h"

REMSimpleModel::REMSimpleModel(REMRenderDevice* pDevice,REMVertexFormat format){
  _pDevice = pDevice;
  _vFormat = format;
}

REMSimpleModel::~REMSimpleModel(){
  free(_pVertices);
  free(_pIndices);
}

int REMSimpleModel::getNumberOfLinesInFile(){
  int ch, number_of_lines = 0;
  do{
    ch = fgetc(_pFile);
    if(ch == '\n')
      number_of_lines++;
  }while (ch != EOF);
  if(ch != '\n' && number_of_lines != 0) number_of_lines++;
  rewind(_pFile);
  log("Model definition is %d lines.", number_of_lines);
  return number_of_lines;
}
int REMSimpleModel::getNumberOfFacesInFile(){
  char ch[MAX_LINE_LENGTH];
  int nof = 0;
  while (fgets(ch,MAX_LINE_LENGTH,_pFile) != NULL){
    char* token = strtok(ch," ");
    if(strcmp("f",token) == 0) nof++;
  }
  rewind(_pFile);
  log("Model definition has %d faces.", nof);
  return nof;
}

void REMSimpleModel::setupObjCache(){
  _pObjVertex = (obj3V*)malloc(_nMaxObjV*sizeof(obj3V)) ;
  _nNumObjVertex = 0;
  _pObjTexCoord = (obj2V*)malloc(_nMaxObjV*sizeof(obj2V)) ;
  _nNumObjTexCoord = 0;
  _pObjNormal = (obj3V*)malloc(_nMaxObjV*sizeof(obj3V)) ;;
  _nNumObjNormal = 0;
}

void REMSimpleModel::setupVertexArrays(){
  switch(_vFormat){
  case UU_VERTEX:
    _pVertices = (REMUUVertex*)malloc(_nMaxObjV*sizeof(REMUUVertex));
    break;
  case UL_VERTEX:
    _pVertices = (REMULVertex*)malloc(_nMaxObjV*sizeof(REMULVertex));
    break;
  }
  _nNumVertices = 0;
  _pIndices = (unsigned short*)malloc(_nMaxObjV*sizeof(unsigned short)) ;
  _nNumIndices = 0;
}

void REMSimpleModel::readFile(const char *chFile){
  _pFile = fopen(chFile,"r");
  if(_pFile == NULL) {
    log("Error Reading File!");
  } else {
    log("Opened %s.",chFile);
    _nMaxObjV = getNumberOfFacesInFile()*3;
    setupVertexArrays();
    setupObjCache();
    bool bLoop = true;
    while (bLoop){
      switch(getNextChunk()){
        case INT_V_POS:
          readObjVertex();
          break;
        case INT_V_NOR:
          readObjNormal();
          break;
        case INT_V_TEX:
          readObjTexCoord();
          break;
        case INT_FACE:
          readObjFace();
          break;
        case -1:
          bLoop = false;
          break;
        case -2:
          break;
      }
    }
    log("Loaded %d vertices.",_nNumVertices);
    log("Finished reading %s.",chFile);
    fclose(_pFile);
    cleanupObjCache();
  }
}

void REMSimpleModel::cleanupObjCache(){
  free(_pObjVertex);
  free(_pObjTexCoord);
  free(_pObjNormal);
}

void REMSimpleModel::readObjVertex(){
  char* token = strtok(NULL," ");
  _pObjVertex[_nNumObjVertex].p[0] = atof(token);
  token = strtok(NULL," ");
  *(_pObjVertex[_nNumObjVertex].p+1) = atof(token); //WTF!?
  token = strtok(NULL," ");
  _pObjVertex[_nNumObjVertex].p[2] = atof(token);
  //log("Read a Vertex Position: %f, %f, %f.",_pObjVertex[_nNumObjVertex].p[0],_pObjVertex[_nNumObjVertex].p[1],_pObjVertex[_nNumObjVertex].p[2]);
  _nNumObjVertex++;
}

void REMSimpleModel::readObjNormal(){
  char* token = strtok(NULL," ");
  _pObjNormal[_nNumObjNormal].p[0] = atof(token);
  token = strtok(NULL," ");
  *(_pObjNormal[_nNumObjNormal].p+4) = atof(token); //WTF!?
  token = strtok(NULL," ");
  _pObjNormal[_nNumObjNormal].p[2] = atof(token);
  //log("Read a Normal Position: %f, %f, %f.",_pObjNormal[_nNumObjNormal].p[0],_pObjNormal[_nNumObjNormal].p[1],_pObjNormal[_nNumObjNormal].p[2]);
  _nNumObjNormal++;
}

void REMSimpleModel::readObjTexCoord(){
  char* token = strtok(NULL," ");
  _pObjTexCoord[_nNumObjTexCoord].p[0] = atof(token);
  token = strtok(NULL," ");
  _pObjTexCoord[_nNumObjTexCoord].p[1] = atof(token);
  //log("Read a TexCoord Position: %f, %f.",_pObjTexCoord[_nNumObjTexCoord].p[0],_pObjTexCoord[_nNumObjTexCoord].p[1]);
  _nNumObjTexCoord++;
}

void REMSimpleModel::readObjFace(){
  char* token[3];
  char* slashtoken;
  token[0] = strtok(NULL," ");
  token[1] = strtok(NULL," ");
  token[2] = strtok(NULL," ");
  for(int i=0;i<3;i++){
    //log(token[i]);
    slashtoken = strtok(token[i],"/");
    switch(_vFormat){
      case UU_VERTEX:
        //position
        memcpy(((REMUUVertex*)_pVertices)[_nNumVertices].vcP,_pObjVertex[atoi(slashtoken)-1].p, 3*sizeof(float));
        ((REMUUVertex*)_pVertices)[_nNumVertices].vcP[3] = 1.0f;

        slashtoken = strtok(NULL,"/");
        //texture
        ((REMUUVertex*)_pVertices)[_nNumVertices].vcT[0] = 65535*_pObjTexCoord[atoi(slashtoken)-1].p[0];
        ((REMUUVertex*)_pVertices)[_nNumVertices].vcT[1] = 65535*_pObjTexCoord[atoi(slashtoken)-1].p[1];

        slashtoken = strtok(NULL,"/");
        //Normals
        memcpy(((REMUUVertex*)_pVertices)[_nNumVertices].vcN,_pObjNormal[atoi(slashtoken)-1].p, 3*sizeof(float));
        ((REMUUVertex*)_pVertices)[_nNumVertices].vcN[3] = 1.0f;
      break;
      case UL_VERTEX:
      //TODO
      break;
    }
    _nNumVertices++;
    ((unsigned short*)_pIndices)[_nNumIndices] = _nNumIndices;
    _nNumIndices++;
  }
}

int REMSimpleModel::getNextChunk(){
  if (fgets(_pChunk,MAX_LINE_LENGTH,_pFile) == NULL) return -1;
  int br;
  char* token = strtok(_pChunk," ");
  if(strcmp("v",token) == 0) br=INT_V_POS;
  else if(strcmp("vn",token) == 0) br=INT_V_NOR;
  else if(strcmp("vt",token) == 0) br=INT_V_TEX;
  else if(strcmp("f",token) == 0) br=INT_FACE;
  else return -2;
  return br;
}

void REMSimpleModel::log(char* chString,...){
  va_list args;
  va_start(args, chString);
  printf("[SimpleModel]: ");
  vprintf(chString, args);
  printf("\n");
  va_end(args);
}
