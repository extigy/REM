#ifndef REMGEOM_H
#define REMGEOM_H
#include <cmath>
#include <string.h>
#include "rem3d.h"
class REMaabb;
class REMobb;
class REMPolygon;
class REMPlane;
class REMRay{
public:
  REMVector _vcOrig,
            _vcDir;
  REMRay();
  inline void set(REMVector vcOrig, REMVector vcDir);
  inline void deTransform(const REMMatrix& _m);

  bool intersects(const REMVector& vc0, const REMVector& vc1, const REMVector& vc2, bool bCull, float* t);
  bool intersects(const REMVector& vc0, const REMVector& vc1, const REMVector& vc2, bool bCull, float fL, float* t);
  bool intersects(const REMPlane& plane, bool bCull, float* t, REMVector* vcHit);
  bool intersects(const REMPlane& plane, bool bCull, float fL, float* t, REMVector* vcHit);
  bool intersects(const REMaabb& aabb, REMVector* vcHit);

  bool intersects(const REMobb* pObb,float* t);
  bool intersects(const REMobb* pObb,float fL, float* t);
};

class REMPlane{
public:
  REMVector _vcN,_vcPoint;
  float _fD;
  REMPlane();
  inline void set (const REMVector& vcN, const REMVector &vcPoint);
  inline void set (const REMVector& vcN, const REMVector &vcPoint, float fD);
  inline void set (const REMVector& v0, const REMVector& v1, const REMVector& v2);
  inline float distance(const REMVector& vcPoint);
  inline int classify(const REMVector& vcPoint);
  int classify(const REMPolygon &Poly);
  bool intersects(const REMVector& vc0, const REMVector& vc1, const REMVector& vc2);
  bool intersects(REMPlane& plane);
  bool intersects(REMPlane& plane, REMRay* pIntersection);
  bool intersects(const REMaabb& aabb);
  bool intersects(const REMobb& obb);
};

class REMaabb{
public:
  REMVector vcMin, vcMax;
  REMVector vcCenter;

  REMaabb();

  void construct(const REMobb& pObb);
  int cull(const REMPlane* pPlanes,int nNumPlanes);
  void getPlanes(REMPlane* pPlanes);
  bool contains(const REMRay& ray, float fL);
  bool intersects(const REMVector& vc);
  bool intersects(const REMaabb& aabb);
};

class REMobb{
public:
  float fA0,fA1,fA2;
  REMVector vcA0,vcA1,vcA2;
  REMVector vcCenter;

  REMobb();
  inline void deTransform(const REMobb& obb,const REMMatrix& m);
  bool intersects(const REMRay& ray, float* t);
  bool intersects(const REMRay& ray, float fL, float* t);
  bool intersects(const REMobb& obb);
  bool intersects(const REMVector& v0, const REMVector& v1, const REMVector& v2);

  int cull(const REMPlane* pPlanes, int nNumPlanes);

private:
  void obbProj(const REMobb& obb, const REMVector& vcV, float* pfMin, float* pfMax);
  void triProj(const REMVector v0, const REMVector v1, const REMVector v2, const REMVector& vcV, float* pfMin, float* pfMax);
};

class REMPolygon{
friend class REMPlane;
private:
  REMPlane _plane;
  int _numP;
  int _numI;
  REMaabb _aabb;
  unsigned int _flag;
  REMVector* _pPoints;
  unsigned int* _pIndis;

  void calcBoundingBox();

public:
  REMPolygon();
  ~REMPolygon();

  void set(const REMVector*, int, const unsigned int*, int);
  void clip(const REMPlane& plane, REMPolygon* pFront, REMPolygon* pBack);
  void clip(const REMaabb& aabb);
  int  cull(const REMaabb& aabb);
  void copyOf(const REMPolygon& poly);

  void swapFaces();
  bool intersects(const REMRay&,bool,float*);
  bool intersects(const REMRay&,bool, float fL, float* t);

  int getNumPoints();
  int getNumIndis();
  REMVector* getPoints();
  unsigned int* getIndices();
  REMPlane getPlane();
  REMaabb getAabb();
  unsigned int getFlag();
  void setFlag(unsigned int n);
};



#endif
