#ifndef CONST_H
#define CONST_H

#define REMFRONT 0
#define REMBACK 1
#define REMPLANAR 2
#define REMCLIPPED 3
#define REMCULLED 4
#define REMVISIBLE 5

#define MAX_ID 65535
#define REMWIDTH 280
#define REMHEIGHT 200

#define REMOK 0
#define REMFAIL -1
#define REMOUTOFMEMORY -1
#define REMINVALIDID -2
#define REMTEXTURESFULL -3
#define REMGLGENTEXTUREERROR -4
#define GENERICERROR -5

typedef enum REMVERTEX_TYPE{
  UU_VERTEX,
  UL_VERTEX
} REMVertexFormat;  //VERTEXID

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

#endif
