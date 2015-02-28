#include "remsimplemodel.h"
#include "const.h"

REMSimpleModel::REMSimpleModel(REMRenderDevice* pDevice,REMVertexFormat format){
  _pDevice = pDevice;
  _vFormat = format;
  _bTex = false;
}

REMSimpleModel::~REMSimpleModel(){
  free(_pVertices);
  free(_pIndices);
}

int REMSimpleModel::getNumberOfLinesInFile(){
  int ch, number_of_lines = 0;
  do{
    ch = fgetc(_pObjFile);
    if(ch == '\n')
      number_of_lines++;
  }while (ch != EOF);
  if(ch != '\n' && number_of_lines != 0) number_of_lines++;
  rewind(_pObjFile);
  log("Model definition is %d lines.", number_of_lines);
  return number_of_lines;
}
int REMSimpleModel::getNumberOfFacesInFile(){
  char ch[MAX_LINE_LENGTH];
  int nof = 0;
  while (fgets(ch,MAX_LINE_LENGTH,_pObjFile) != NULL){
    char* token = strtok(ch," ");
    if(strcmp("f",token) == 0) nof++;
  }
  rewind(_pObjFile);
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

void REMSimpleModel::handleMTL(){
  char matFilename[1024];
  sprintf(matFilename,"models/%s.mtl",strtok(NULL," \n"));
  _pMTLFile = fopen(matFilename,"r");

  if(_pMTLFile == NULL) {
   log("Error reading material file!");
  } else {
   log("Opened material file %s",matFilename);
   bool bLoop = true;
   while (bLoop){
     switch(getMTLNextChunk()){
        case MTL_NS:
          _fSpecPower = atof(strtok(NULL," "));
          log("Material specular component: %f",_fSpecPower);
          break;
        case MTL_KA:
          _cAmbient.fR = atof(strtok(NULL," "));
          _cAmbient.fG = atof(strtok(NULL," "));
          _cAmbient.fB = atof(strtok(NULL," "));
          log("Material ambient colour: (%f, %f, %f)",_cAmbient.fR,_cAmbient.fG,_cAmbient.fB);
          break;
        case MTL_KD:
          _cDiffuse.fR = atof(strtok(NULL," "));
          _cDiffuse.fG = atof(strtok(NULL," "));
          _cDiffuse.fB = atof(strtok(NULL," "));
          log("Material diffuse colour: (%f, %f, %f)",_cDiffuse.fR,_cDiffuse.fG,_cDiffuse.fB);
          break;
        case MTL_KS:
          _cSpecular.fR = atof(strtok(NULL," "));
          _cSpecular.fG = atof(strtok(NULL," "));
          _cSpecular.fB = atof(strtok(NULL," "));
          log("Material specular colour: (%f, %f, %f)",_cSpecular.fR,_cSpecular.fG,_cSpecular.fB);
          break;
        case MTL_KE:
          _cEmissive.fR = atof(strtok(NULL," "));
          _cEmissive.fG = atof(strtok(NULL," "));
          _cEmissive.fB = atof(strtok(NULL," "));
          log("Material emissive colour: (%f, %f, %f)",_cEmissive.fR,_cEmissive.fG,_cEmissive.fB);
          break;
        case MTL_D:
          _alpha = atof(strtok(NULL," "));
          _cAmbient.fA = _alpha;
          _cDiffuse.fA = _alpha;
          _cSpecular.fA = _alpha;
          _cEmissive.fA = _alpha;
          log("Material alpha: %f",_alpha);
          break;
        case MTL_MAP_KA:
          _bTex = true;
          sprintf(_kaFilename,"textures/%s",strtok(NULL," \n"));
          log("Ambient texture: %s",_kaFilename);
          break;
        case MTL_MAP_KD:
          _bTex = true;
          sprintf(_kdFilename,"textures/%s",strtok(NULL," \n"));
          log("Diffuse texture: %s",_kdFilename);
          break;
        case -1:
          bLoop = false;
          break;
        case -2:
          break;
      }
    }
    log("Finished reading %s.",matFilename);
    fclose(_pMTLFile);
    setupMTL();
  }
}

void REMSimpleModel::setupMTL(){
  _pDevice->getSkinManager()->addSkin(&_cAmbient,&_cDiffuse,&_cSpecular,&_cEmissive, _fSpecPower, &_nSkin);
  if(_bTex)_pDevice->getSkinManager()->addTexture(_nSkin, _kdFilename, true, _alpha, NULL, 0);
  //if(_bDetail)_pDevice->getSkinManager()->addTexture(nSkinID, "textures/brick-detail.jpg", true, 1.0f, NULL, 0);
}

int REMSimpleModel::getMTLNextChunk(){
  if (fgets(_pMTLChunk,MAX_LINE_LENGTH,_pMTLFile) == NULL) return -1;
  int br;
  char* token = strtok(_pMTLChunk," ");
  if(strcmp("Ns",token) == 0) br=MTL_NS;
  else if(strcmp("d",token) == 0) br=MTL_D;
  else if(strcmp("illum",token) == 0) br=MTL_ILLUM;
  else if(strcmp("Ka",token) == 0) br=MTL_KA;
  else if(strcmp("Kd",token) == 0) br=MTL_KD;
  else if(strcmp("Ks",token) == 0) br=MTL_KS;
  else if(strcmp("Ke",token) == 0) br=MTL_KE;
  else if(strcmp("map_Ka",token) == 0) br=MTL_MAP_KA;
  else if(strcmp("map_Kd",token) == 0) br=MTL_MAP_KD;
  else return -2;
  return br;
}

void REMSimpleModel::readFile(const char *chFile){
  _pObjFile = fopen(chFile,"r");
  if(_pObjFile == NULL) {
    log("Error Reading File!");
  } else {
    log("Opened %s.",chFile);
    _nMaxObjV = getNumberOfFacesInFile()*3;
    setupVertexArrays();
    setupObjCache();
    bool bLoop = true;
    while (bLoop){
      switch(getObjNextChunk()){
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
        case INT_MTL:
          handleMTL();
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
    fclose(_pObjFile);
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
  *(_pObjNormal[_nNumObjNormal].p+1) = atof(token); //WTF!?
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
        ((REMUUVertex*)_pVertices)[_nNumVertices].vcN[3] = 0.0f;
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

int REMSimpleModel::getObjNextChunk(){
  if (fgets(_pChunk,MAX_LINE_LENGTH,_pObjFile) == NULL) return -1;
  int br;
  char* token = strtok(_pChunk," ");
  if(strcmp("v",token) == 0) br=INT_V_POS;
  else if(strcmp("vn",token) == 0) br=INT_V_NOR;
  else if(strcmp("vt",token) == 0) br=INT_V_TEX;
  else if(strcmp("f",token) == 0) br=INT_FACE;
  else if(strcmp("usemtl",token) == 0) br=INT_MTL;
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
