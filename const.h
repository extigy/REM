#ifndef CONST_H
#define CONST_H

#define REMFRONT 0
#define REMBACK 1
#define REMPLANAR 2
#define REMCLIPPED 3
#define REMCULLED 4
#define REMVISIBLE 5

#define MAX_ID 65535
#define NUM_CACHES 50
#define REMWIDTH 640
#define REMHEIGHT 360

#define REMOK 0
#define REMFAIL -1
#define REMOUTOFMEMORY -1
#define REMINVALIDID -2
#define REMTEXTURESFULL -3
#define REMGLGENTEXTUREERROR -4
#define GENERICERROR -5s

typedef enum REMVERTEX_TYPE{
  UU_VERTEX = 0,
  UL_VERTEX,
  CEL_VERTEX
} REMVertexFormat;  //VERTEX Type

typedef struct UU_VERTEX_TYPE {
  float vcP[4];           //position
  float vcN[4];           //normal
  unsigned short vcT[2];  //texture
  unsigned short vcTD[2];  //texture detail map
  float vcU[4];           //tangent
} REMUUVertex;

typedef struct CEL_VERTEX_TYPE {
  float vcP[4];           //position
  float vcN[4];           //normal
  float vcU[4];           //tangent
} REMCELVertex;

typedef struct UL_VERTEX_TYPE {
  float vcP[4];           //position
  float vcC[4];           //colour
  unsigned short vcT[2];  //texture
} REMULVertex;

typedef enum REMRENDERSTATE_TYPE{
  RS_CULL_CW,
  RS_CULL_CCW,
  RS_CULL_NONE,
  RS_DEPTH_READWRITE,
  RS_DEPTH_READONLY,
  RS_DEPTH_NONE,
  RS_SHADE_POINTS,
  RS_SHADE_TRIWIRE,
  RS_SHADE_HULLWIRE,
  RS_SHADE_SOLID
} REMRenderState;

typedef struct POINT_TYPE{
  unsigned int x;
  unsigned int y;
} POINT;

typedef struct REMVIEWPORT_TYPE{
  unsigned int x;
  unsigned int y;
  unsigned int width;
  unsigned int height;
} REMViewport;

typedef enum REMENGINEMODE_TYPE{
  PERSPECTIVE,
  TWOD,
  ORTHOGONAL
} REMEngineMode;

typedef struct REMBUFFER_TYPE {
  int nStride;
  unsigned int nSkinID;
  bool bIndis;
  int nNumVerts;
  int nNumIndis;
  int nNumTris;
  unsigned int pVB = -1;
  unsigned int pIB = -1;
  void* pVD;
  unsigned short* pID;
  REMVertexFormat vF;
} REMBuffer;

typedef struct REMCOLOUR_TYPE{
  union{
    struct{
      float fR;
      float fG;
      float fB;
      float fA;
    };
    float c[4];
  };
} REMColour;

typedef enum REMINPUT_TYPE{
  IDV_KEYBOARD,
  IDV_JOYSTICK,
  IDV_MOUSE
} REMInputType;

#endif
