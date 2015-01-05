#include "rem3d.h"
#include "remgeom.h"
#include "const.h"

REMRay::REMRay(){};
inline void REMRay::set(REMVector vcOrig, REMVector vcDir){
  _vcOrig = vcOrig;
  _vcDir = vcDir;
};
inline void REMRay::deTransform(const REMMatrix& _m){
  REMMatrix mInv;
  REMMatrix m=_m;

  _vcOrig.x -= m._data[3][0];
  _vcOrig.y -= m._data[3][1];
  _vcOrig.z -= m._data[3][2];

  m._data[3][0] = 0.0f; m._data[3][1]=0.0f; m._data[3][2]=0.0f;

  mInv.inverseOf(m);

  _vcOrig = _vcOrig*mInv;
  _vcDir  =  _vcDir*mInv;
};

bool REMRay::intersects(const REMVector& vc0, const REMVector& vc1, const REMVector& vc2, bool bCull, float* t){
  REMVector pvec,tvec,qvec;
  REMVector edge1 = vc1-vc0;
  REMVector edge2 = vc2-vc0;
  pvec.cross(_vcDir,edge2);
  float det = edge1*pvec;

  if((bCull) && (det < 0.0001f)){
    return false;
  } else if ((det < 0.0001f) && (det > -0.0001f)){
    return false;
  }

  tvec = _vcOrig - vc0;
  float u = tvec*pvec;
  if(u<0.0f || u>det) return false;

  qvec.cross(tvec,edge1);

  float v = _vcDir*qvec;
  if(v<0.0f || u+v > det) return false;

  if(t){
    *t = edge2*qvec;
    float fInvDet = 1.0f/det;
    *t *= fInvDet;
  }
  return true;
};
bool REMRay::intersects(const REMVector& vc0, const REMVector& vc1, const REMVector& vc2, bool bCull, float fL, float* t){
  bool ret= intersects(vc0,vc1,vc2,bCull,t);
  if(*t<0.0f || *t>fL) return false;
  return ret;
};
bool REMRay::intersects(const REMPlane& plane, bool bCull, float* t, REMVector* vcHit){
  float Vd = plane._vcN * _vcDir;
  if(fabs(Vd) < 0.00001f) return false;

  if(bCull && (Vd > 0.0f)) return false;

  float Vo = -((plane._vcN*_vcOrig)+plane._fD);
  float _t= Vo/Vd;

  if(_t<0.0f) return false;

  if(vcHit) (*vcHit) = _vcOrig+(_vcDir*_t);

  if(t) (*t) = _t;

  return true;
};
bool REMRay::intersects(const REMPlane& plane, bool bCull, float fL, float* t, REMVector* vcHit){
  bool ret = intersects(plane,bCull,fL,t,vcHit);
  if(*t<0.0f || *t>fL) return false;
  return ret;
};
bool REMRay::intersects(const REMaabb& aabb, REMVector* vcHit){
  bool bInside = true;
  REMVector maxT;

  maxT.set(-1.0f,-1.0f,-1.0f);

  if(_vcOrig.x < aabb.vcMin.x){
    (*vcHit).x = aabb.vcMin.x;
    bInside = false;
    if(_vcDir.x != 0.0f) maxT.x = (aabb.vcMin.x - _vcOrig.x)/_vcDir.x;
  } else if(_vcOrig.x > aabb.vcMin.x){
    (*vcHit).x = aabb.vcMax.x;
    bInside = false;
    if(_vcDir.x != 0.0f) maxT.x = (aabb.vcMax.x - _vcOrig.x)/_vcDir.x;
  }

  if(_vcOrig.y < aabb.vcMin.y){
    (*vcHit).y = aabb.vcMin.y;
    bInside = false;
    if(_vcDir.y != 0.0f) maxT.y = (aabb.vcMin.y - _vcOrig.y)/_vcDir.y;
  } else if(_vcOrig.y > aabb.vcMin.y){
    (*vcHit).y = aabb.vcMax.y;
    bInside = false;
    if(_vcDir.y != 0.0f) maxT.x = (aabb.vcMax.y - _vcOrig.x)/_vcDir.y;
  }

  if(_vcOrig.z < aabb.vcMin.z){
    (*vcHit).z = aabb.vcMin.z;
    bInside = false;
    if(_vcDir.z != 0.0f) maxT.z = (aabb.vcMin.z - _vcOrig.z)/_vcDir.z;
  } else if(_vcOrig.z > aabb.vcMin.z){
    (*vcHit).z = aabb.vcMax.z;
    bInside = false;
    if(_vcDir.z != 0.0f) maxT.z = (aabb.vcMax.z - _vcOrig.z)/_vcDir.z;
  }

  if(bInside){
    (*vcHit) = _vcOrig;
    return true;
  }

  int nPlane=0;

  if(maxT.y > ((float*)&maxT)[nPlane]) nPlane = 1;
  if(maxT.z > ((float*)&maxT)[nPlane]) nPlane = 2;

  if(((float*)&maxT)[nPlane]<0.0f) return false;

  if(nPlane!=0){
    (*vcHit).x = _vcOrig.x + maxT.x*_vcDir.x;
    if(((*vcHit).x < aabb.vcMin.x-0.00001f) || ((*vcHit).x < aabb.vcMax.x+0.00001f)) return false;
  }

  if(nPlane!=2){
    (*vcHit).y = _vcOrig.y + maxT.y*_vcDir.y;
    if(((*vcHit).y < aabb.vcMin.y-0.00001f) || ((*vcHit).y < aabb.vcMax.y+0.00001f)) return false;
  }

  if(nPlane!=2){
    (*vcHit).z = _vcOrig.z + maxT.z*_vcDir.z;
    if(((*vcHit).z < aabb.vcMin.z-0.00001f) || ((*vcHit).z < aabb.vcMax.z+0.00001f)) return false;
  }
  return true;
};

bool REMRay::intersects(const REMobb* pobb,float fL, float* t){
  bool ret = intersects(pobb,t);
  if(*t<0.0f || *t>fL) return false;
};

bool REMRay::intersects(const REMobb* pobb,float* t){
  float e, f, t1,t2,temp;
  float tmin= -99999.9;
  float tmax= +99999.9;

  REMVector vcP=pobb->vcCenter - _vcOrig;

  e=pobb->vcA0 * vcP;
  f=pobb->vcA0 * _vcDir;

  if(fabs(f)>0.00001f){
    t1=(e + pobb->fA0) / f;
    t2=(e - pobb->fA0) / f;

    if(t1>t2) {
      temp=t1;t1=t2;t2=temp;
    }
    if(t1>tmin)tmin=t1;
    if(t2<tmax)tmax=t2;
    if(tmin>tmax) return false;
    if(tmax<0.0f) return false;
  } else if (((-e - pobb->fA0) >0.0f) || ((-e + pobb->fA0) <0.0f)){
    return false;
  }

  e=pobb->vcA1 * vcP;
  f=pobb->vcA1 * _vcDir;

  if(fabs(f)>0.00001f){
    t1=(e + pobb->fA1) / f;
    t2=(e - pobb->fA1) / f;

    if(t1>t2) { temp=t1;t1=t2;t2=temp;}
    if(t1>tmin)tmin=t1;
    if(t2<tmax)tmax=t2;
    if(tmin>tmax) return false;
    if(tmax<0.0f) return false;
  } else if (((-e - pobb->fA1) >0.0f) || ((-e + pobb->fA1) <0.0f)){
    return false;
  }

  e=pobb->vcA2 * vcP;
  f=pobb->vcA2 * _vcDir;

  if(fabs(f)>0.00001f){
    t1=(e + pobb->fA2) / f;
    t2=(e - pobb->fA2) / f;

    if(t1>t2) { temp=t1;t1=t2;t2=temp;}
    if(t1>tmin)tmin=t1;
    if(t2<tmax)tmax=t2;
    if(tmin>tmax) return false;
    if(tmax<0.0f) return false;
  } else if (((-e - pobb->fA2) >0.0f) || ((-e + pobb->fA2) <0.0f)){
    return false;
  }

  if(tmin>0.0f && (tmin <= tmax)){
    if (t) *t = tmin;
    return true;
  }
  if (t) *t=tmax;
  return true;
}

REMPlane::REMPlane(){};
inline void REMPlane::set (const REMVector& vcN, const REMVector &vcPoint){
  _fD = -(vcN*vcPoint);
  _vcN = vcN;
  _vcPoint = vcPoint;
};
inline void REMPlane::set (const REMVector& vcN, const REMVector &vcPoint, float fD){
  _vcN = vcN;
  _fD = fD;
  _vcPoint = vcPoint;
};
inline void REMPlane::set (const REMVector& v0, const REMVector& v1, const REMVector& v2){
  REMVector vcEdge1 = v1-v0;
  REMVector vcEdge2 = v2-v0;
  _vcN.cross(vcEdge1,vcEdge2);
  _fD=_vcN*v0;
};
inline float REMPlane::distance(const REMVector& vcPoint){
  return (fabs((_vcN*vcPoint)-_fD));
};
inline int REMPlane::classify(const REMVector& vcPoint){
  float f = (vcPoint*_vcN)+_fD;
  if(f>0.00001f)return REMFRONT;
  if(f<-0.00001f)return REMBACK;
  return REMPLANAR;
};
int REMPlane::classify(const REMPolygon &Poly) {
  int NumFront = 0, NumBack = 0, NumPlanar = 0;
  int nClass;

  REMPolygon *pPoly = ((REMPolygon*)&Poly);
  int NumPoints = pPoly->getNumPoints();

  for (int i = 0; i < NumPoints; i++) {
    nClass = classify(pPoly->_pPoints[i]);
    if (nClass == REMFRONT){
        NumFront++;
    } else if (nClass == REMBACK){
        NumBack++;
    } else {
        NumFront++;
        NumBack++;
        NumPlanar++;
    }
  }

  if (NumPlanar == NumPoints){
    return REMPLANAR;
  } else if (NumFront == NumPoints){
    return REMFRONT;
  } else if (NumBack == NumPoints){
    return REMBACK;
  }else{
    return REMCLIPPED;
  }
}
bool REMPlane::intersects(const REMVector& vc0, const REMVector& vc1, const REMVector& vc2){
  int n = this->classify(vc0);
  if((n==this->classify(vc1)) && (n==this->classify(vc2))) return false;
  return true;
};
bool REMPlane::intersects(REMPlane& plane){
  return intersects(plane, NULL);
}
bool REMPlane::intersects(REMPlane& plane, REMRay* pIntersection){
  REMVector vcCross;
  float fSqrLength;

  vcCross.cross(this->_vcN,plane._vcN);
  fSqrLength = vcCross.getSqrLength();

  if(fSqrLength < 1e-08f) return false;
  if(pIntersection){
    float fN00 = this->_vcN.getSqrLength();
    float fN01 = this->_vcN*plane._vcN;
    float fN11 = plane._vcN.getSqrLength();
    float fDet = fN00*fN11 - fN01*fN01;

    if(fabs(fDet)<1e-08f) return false;

    float fInvDet = 1.0f/fDet;
    float fC0 = (fN11*this->_fD - fN01*plane._fD)*fInvDet;
    float fC1 = (fN00*plane._fD - fN01*this->_fD)*fInvDet;

    (*pIntersection)._vcDir = vcCross;
    (*pIntersection)._vcOrig = this->_vcN*fC0 + plane._vcN*fC1;
  }
  return true;
};
bool REMPlane::intersects(const REMaabb& aabb){
  REMVector Vmin, Vmax;
  if(_vcN.x >= 0.0f){
    Vmin.x = aabb.vcMin.x;
    Vmax.x = aabb.vcMax.x;
  } else {
    Vmin.x = aabb.vcMax.x;
    Vmax.x = aabb.vcMin.x;
  }
  if(_vcN.y >= 0.0f){
    Vmin.y = aabb.vcMin.y;
    Vmax.y = aabb.vcMax.y;
  } else {
    Vmin.y = aabb.vcMax.y;
    Vmax.y = aabb.vcMin.y;
  }
  if(_vcN.z >= 0.0f){
    Vmin.z = aabb.vcMin.z;
    Vmax.z = aabb.vcMax.z;
  } else {
    Vmin.z = aabb.vcMax.z;
    Vmax.z = aabb.vcMin.z;
  }

  if (((_vcN*Vmin) + _fD)>0.0f) return false;
  if (((_vcN*Vmax) + _fD)>=0.0f) return true;

  return false;
};

bool REMPlane::intersects(const REMobb& obb){
  float fRadius = fabs(obb.fA0 * (_vcN*obb.vcA0))+
  fabs(obb.fA1 * (_vcN*obb.vcA1))+
  fabs(obb.fA2 * (_vcN*obb.vcA2));
  float fDistance = this->distance(obb.vcCenter);
  return (fDistance <= fRadius);

};

void REMaabb::construct(const REMobb& obb){
  REMVector vcA0,vcA1,vcA2;
  REMVector _vcMax,_vcMin;
  vcA0 = obb.vcA0 * obb.fA0;
  vcA1 = obb.vcA1 * obb.fA1;
  vcA2 = obb.vcA2 * obb.fA2;

  if(vcA0.x > vcA1.x){
    if(vcA0.x>vcA2.x){
      vcMax.x=vcA0.x;vcMin.x=-vcA0.x;
    } else {
      vcMax.x=vcA2.x;vcMin.x=-vcA2.x;
    }
  } else {
    if(vcA1.x>vcA2.x){
      vcMax.x=vcA1.x;vcMin.x=-vcA1.x;
    } else {
      vcMax.x=vcA2.x;vcMin.x=-vcA2.x;
    }
  }
  if(vcA0.y > vcA1.y){
    if(vcA0.y>vcA2.y){
      vcMax.y=vcA0.y;vcMin.y=-vcA0.y;
    } else {
      vcMax.y=vcA2.y;vcMin.y=-vcA2.y;
    }
  } else {
    if(vcA1.y>vcA2.y){
      vcMax.y=vcA1.y;vcMin.y=-vcA1.y;
    } else {
      vcMax.y=vcA2.y;vcMin.y=-vcA2.y;
    }
  }
  if(vcA0.z > vcA1.z){
    if(vcA0.z>vcA2.z){
      vcMax.z=vcA0.z;vcMin.z=-vcA0.z;
    } else {
      vcMax.z=vcA2.z;vcMin.z=-vcA2.z;
    }
  } else {
    if(vcA1.z>vcA2.z){
      vcMax.z=vcA1.z;vcMin.z=-vcA1.z;
    } else {
      vcMax.z=vcA2.z;vcMin.z=-vcA2.z;
    }
  }
  vcMax += obb.vcCenter;
  vcMin += obb.vcCenter;
}

int REMaabb::cull(const REMPlane* pPlanes,int nNumPlanes){
  REMVector vcMin, vcMax;
  bool bIntersects = false;
  for(int i=0;i<nNumPlanes;i++){
    if(pPlanes[i]._vcN.x >= 0.0f){
      vcMin.x = this->vcMin.x;
      vcMax.x = this->vcMax.x;
    } else {
      vcMin.x = this->vcMax.x;
      vcMax.x = this->vcMin.x;
    }
    if(pPlanes[i]._vcN.y >= 0.0f){
      vcMin.y = this->vcMin.y;
      vcMax.y = this->vcMax.y;
    } else {
      vcMin.y = this->vcMax.y;
      vcMax.y = this->vcMin.y;
    }
    if(pPlanes[i]._vcN.z >= 0.0f){
      vcMin.z = this->vcMin.z;
      vcMax.z = this->vcMax.z;
    } else {
      vcMin.z = this->vcMax.z;
      vcMax.z = this->vcMin.z;
    }

    if(((pPlanes[i]._vcN*vcMin)+pPlanes[i]._fD)>0.0f) return REMCULLED;
    if(((pPlanes[i]._vcN*vcMax)+pPlanes[i]._fD)>=0.0f) bIntersects = true;
  }
  if(bIntersects) return REMCLIPPED;
  return REMVISIBLE;
};

inline void REMobb::deTransform(const REMobb& obb, const REMMatrix& m){
  REMMatrix mat = m;
  REMVector vcT;

  vcT.set(mat._data[3][0],mat._data[3][1],mat._data[3][2]);
  mat._data[3][0]=mat._data[3][1]=mat._data[3][2]=0.0f;

  this->vcCenter = mat*obb.vcCenter;
  this->vcA0 = mat*obb.vcA0;
  this->vcA1 = mat*obb.vcA1;
  this->vcA2 = mat*obb.vcA2;

  this->vcCenter += vcT;

  fA0 = obb.fA0;
  fA1 = obb.fA1;
  fA2 = obb.fA1;
}

int REMobb::cull(const REMPlane* pPlanes, int nNumPlanes){
  REMVector vN;
  int nResult = REMVISIBLE;
  float fRadius,fTest;

  for(int i=0;i<nNumPlanes;i++){
    vN = pPlanes[i]._vcN * -1.0f;
    fRadius = fabs(fA0*(vN*vcA0))+fabs(fA1*(vN*vcA1))+fabs(fA2*(vN*vcA2));
    fTest = vN * this->vcCenter - pPlanes[i]._fD;

    if(fTest < -fRadius){
      return REMCULLED;
    } else if (!(fTest > fRadius)){
      nResult = REMCLIPPED;
    }
  }
  return nResult;
}

void REMobb::obbProj(const REMobb& obb, const REMVector& vcV, float* pfMin, float* pfMax){
  float fDP=vcV*(obb.vcCenter);
  float fR=obb.fA0*fabs(vcV*obb.vcA0)+
  obb.fA0*fabs(vcV*obb.vcA1)+
  obb.fA1*fabs(vcV*obb.vcA0);
  (*pfMin)=(fDP-fR);
  (*pfMax)=(fDP+fR);
}

void REMobb::triProj(const REMVector v0, const REMVector v1, const REMVector v2, const REMVector& vcV, float* pfMin, float* pfMax){
  *pfMin=vcV*v0;
  *pfMax=*pfMin;

  float fDP=vcV*v1;
  if(fDP<*pfMin){
    *pfMin=fDP;
  } else if(fDP>*pfMax){
    *pfMax=fDP;
  }
  fDP=vcV*v2;
  if(fDP<*pfMin){
    *pfMin=fDP;
  } else if(fDP> *pfMax){
    *pfMax=fDP;
  }
}

bool REMobb::intersects(const REMVector& v0, const REMVector& v1, const REMVector& v2){
  float fMin0,fMax0,fMin1,fMax1;
  float fD_C;
  REMVector vcV, vcTriEdge[3],vcA[3];

  vcA[0]=this->vcA0;
  vcA[1]=this->vcA1;
  vcA[2]=this->vcA2;

  vcTriEdge[0]=v1-v0;
  vcTriEdge[1]=v2-v0;

  vcV.cross(vcTriEdge[0],vcTriEdge[1]);
  fMin0=vcV*v0;
  fMax0=fMin0;
  this->obbProj((*this),vcV,&fMin1,&fMax1);
  if(fMax1<fMin0 || fMax0<fMin1) return false;

  vcV=this->vcA0;
  this->triProj(v0,v1,v2,vcV,&fMin0,&fMax0);
  fD_C=vcV*this->vcCenter;
  fMin1=fD_C - this->fA0;
  fMax1=fD_C + this->fA0;
  if(fMax1<fMin0 || fMax0<fMin1) return false;

  vcV=this->vcA1;
  this->triProj(v0,v1,v2,vcV,&fMin0,&fMax0);
  fD_C=vcV*this->vcCenter;
  fMin1=fD_C - this->fA1;
  fMax1=fD_C + this->fA1;
  if(fMax1<fMin0 || fMax0<fMin1) return false;

  vcV=this->vcA2;
  this->triProj(v0,v1,v2,vcV,&fMin0,&fMax0);
  fD_C=vcV*this->vcCenter;
  fMin1=fD_C - this->fA2;
  fMax1=fD_C + this->fA2;
  if(fMax1<fMin0 || fMax0<fMin1) return false;

  vcTriEdge[2]=vcTriEdge[1]-vcTriEdge[0];
  for(int j=0;j<3;j++){
    for(int k=0;k<3;k++){
      vcV.cross(vcTriEdge[j],vcA[k]);
      this->triProj(v0,v1,v2,vcV,&fMin0,&fMax0);
      this->obbProj((*this),vcV,&fMin1,&fMax1);
      if((fMax1<fMin0) || (fMax0 < fMin1)) return false;
    }
  }
  return true;
}

bool REMobb::intersects(const REMobb& obb) {
  float T[3];
  REMVector vcD = obb.vcCenter - this->vcCenter;
  float matM[3][3];
  float ra,rb,t;
  matM[0][0] = this->vcA0 * obb.vcA0;
  matM[0][1] = this->vcA0 * obb.vcA1;
  matM[0][2] = this->vcA0 * obb.vcA2;
  ra   = this->fA0;
  rb   = obb.fA0 * fabs(matM[0][0]) + obb.fA1 * fabs(matM[0][1]) + obb.fA2 * fabs(matM[0][2]);

  T[0] = vcD * this->vcA0;
  t    = fabs(T[0]);
  if(t > (ra + rb) ) return false;

  matM[1][0] = this->vcA1 * obb.vcA0;
  matM[1][1] = this->vcA1 * obb.vcA1;
  matM[1][2] = this->vcA1 * obb.vcA2;
  ra   = this->fA1;
  rb   = obb.fA0 * fabs(matM[1][0]) + obb.fA1 * fabs(matM[1][1]) + obb.fA2 * fabs(matM[1][2]);
  T[1] = vcD * this->vcA1;
  t    = fabs(T[1]);
  if(t > (ra + rb) ) return false;

  matM[2][0] = this->vcA2 * obb.vcA0;
  matM[2][1] = this->vcA2 * obb.vcA1;
  matM[2][2] = this->vcA2 * obb.vcA2;
  ra   = this->fA2;
  rb   = obb.fA0 * fabs(matM[2][0]) + obb.fA1 * fabs(matM[2][1]) + obb.fA2 * fabs(matM[2][2]);
  T[2] = vcD * this->vcA2;
  t    = fabs(T[2]);
  if(t > (ra + rb) ) return false;

  ra = this->fA0 * fabs(matM[0][0]) + this->fA1 * fabs(matM[1][0]) + this->fA2 * fabs(matM[2][0]);
  rb = obb.fA0;
  t = fabs( T[0]*matM[0][0] + T[1]*matM[1][0] + T[2]*matM[2][0] );
  if(t > (ra + rb) ) return false;

  ra = this->fA0 * fabs(matM[0][1]) + this->fA1 * fabs(matM[1][1]) + this->fA2 * fabs(matM[2][1]);
  rb = obb.fA1;
  t = fabs( T[0]*matM[0][1] + T[1]*matM[1][1] + T[2]*matM[2][1] );
  if(t > (ra + rb) ) return false;

  ra = this->fA0 * fabs(matM[0][2]) + this->fA1 * fabs(matM[1][2]) + this->fA2 * fabs(matM[2][2]);
  rb = obb.fA2;
  t = fabs( T[0]*matM[0][2] + T[1]*matM[1][2] + T[2]*matM[2][2] );
  if(t > (ra + rb) ) return false;

  ra = this->fA1*fabs(matM[2][0]) + this->fA2*fabs(matM[1][0]);
  rb = obb.fA1*fabs(matM[0][2]) + obb.fA2*fabs(matM[0][1]);
  t = fabs( T[2]*matM[1][0] - T[1]*matM[2][0] );
  if( t > ra + rb ) return false;

  ra = this->fA1*fabs(matM[2][1]) + this->fA2*fabs(matM[1][1]);
  rb = obb.fA0*fabs(matM[0][2]) + obb.fA2*fabs(matM[0][0]);
  t = fabs( T[2]*matM[1][1] - T[1]*matM[2][1] );
  if( t > ra + rb ) return false;

  ra = this->fA1*fabs(matM[2][2]) + this->fA2*fabs(matM[1][2]);
  rb = obb.fA0*fabs(matM[0][1]) + obb.fA1*fabs(matM[0][0]);
  t = fabs( T[2]*matM[1][2] - T[1]*matM[2][2] );
  if( t > ra + rb ) return false;

  ra = this->fA0*fabs(matM[2][0]) + this->fA2*fabs(matM[0][0]);
  rb = obb.fA1*fabs(matM[1][2]) + obb.fA2*fabs(matM[1][1]);
  t = fabs( T[0]*matM[2][0] - T[2]*matM[0][0] );
  if( t > ra + rb ) return false;

  ra = this->fA0*fabs(matM[2][1]) + this->fA2*fabs(matM[0][1]);
  rb = obb.fA0*fabs(matM[1][2]) + obb.fA2*fabs(matM[1][0]);
  t = fabs( T[0]*matM[2][1] - T[2]*matM[0][1] );
  if( t > ra + rb ) return false;

  ra = this->fA0*fabs(matM[2][2]) + this->fA2*fabs(matM[0][2]);
  rb = obb.fA0*fabs(matM[1][1]) + obb.fA1*fabs(matM[1][0]);
  t = fabs( T[0]*matM[2][2] - T[2]*matM[0][2] );
  if( t > ra + rb ) return false;

  ra = this->fA0*fabs(matM[1][0]) + this->fA1*fabs(matM[0][0]);
  rb = obb.fA1*fabs(matM[2][2]) + obb.fA2*fabs(matM[2][1]);
  t = fabs( T[1]*matM[0][0] - T[0]*matM[1][0] );
  if( t > ra + rb ) return false;

  ra = this->fA0*fabs(matM[1][1]) + this->fA1*fabs(matM[0][1]);
  rb = obb.fA0 *fabs(matM[2][2]) + obb.fA2*fabs(matM[2][0]);
  t = fabs( T[1]*matM[0][1] - T[0]*matM[1][1] );
  if( t > ra + rb ) return false;

  ra = this->fA0*fabs(matM[1][2]) + this->fA1*fabs(matM[0][2]);
  rb = obb.fA0*fabs(matM[2][1]) + obb.fA1*fabs(matM[2][0]);
  t = fabs( T[1]*matM[0][2] - T[0]*matM[1][2] );
  if( t > ra + rb ) return false;

  return true;
}

void REMaabb::getPlanes(REMPlane *pPlanes){
  REMVector vcN;
  if(!pPlanes) return;

  vcN.set(1.0f,0.0f,0.0f);
  pPlanes[0].set(vcN,vcMax);

  vcN.set(-1.0f,0.0f,0.0f);
  pPlanes[1].set(vcN,vcMin);

  vcN.set(0.0f,0.0f,-1.0f);
  pPlanes[2].set(vcN,vcMin);

  vcN.set(0.0f,0.0f,1.0f);
  pPlanes[3].set(vcN,vcMax);

  vcN.set(0.0f,1.0f,0.0f);
  pPlanes[4].set(vcN,vcMax);

  vcN.set(0.0f,-1.0f,0.0f);
  pPlanes[5].set(vcN,vcMin);
}

bool REMaabb::contains(const REMRay& ray, float fL){
  REMVector vcEnd = ray._vcOrig + (ray._vcDir *fL);
  return(intersects(ray._vcOrig)&&intersects(vcEnd));
}

bool REMaabb::intersects(const REMVector &vc) {
  if ( vc.x > vcMax.x ) return false;
  if ( vc.y > vcMax.y ) return false;
  if ( vc.z > vcMax.z ) return false;
  if ( vc.x < vcMin.x ) return false;
  if ( vc.y < vcMin.y ) return false;
  if ( vc.z < vcMin.z ) return false;
  return true;
}

bool REMaabb::intersects(const REMaabb &aabb) {
  if ((vcMin.x > aabb.vcMax.x) || (aabb.vcMin.x > vcMax.x)) return false;
  if ((vcMin.y > aabb.vcMax.y) || (aabb.vcMin.y > vcMax.y)) return false;
  if ((vcMin.z > aabb.vcMax.z) || (aabb.vcMin.z > vcMax.z)) return false;
  return true;
}

REMPolygon::REMPolygon(){
  _pPoints = NULL;
  _pIndis = NULL;
  _numP = 0;
  _numI = 0;
  _flag = 0;
  memset(&_aabb, 0, sizeof(REMaabb));
}

REMPolygon::~REMPolygon(){
  if(_pPoints){
    delete [] _pPoints;
    _pPoints = NULL;
  }
  if(_pIndis){
    delete [] _pIndis;
    _pIndis = NULL;
  }
}

int REMPolygon::getNumPoints(){return _numP;}
int REMPolygon::getNumIndis(){return _numI;}
REMVector* REMPolygon::getPoints(){return _pPoints;}
unsigned int* REMPolygon::getIndices(){return _pIndis;}
REMPlane REMPolygon::getPlane(){return _plane;}
REMaabb REMPolygon::getAabb(){return _aabb;}
unsigned int REMPolygon::getFlag(){return _flag;}
void REMPolygon::setFlag(unsigned int n){_flag = n;}

void REMPolygon::set(const REMVector* pPoints, int nNumP, const unsigned int *pIndis, int nNumI){
  REMVector vcEdge0, vcEdge1;
  bool bGE = false;
  if(_pPoints) delete [] _pPoints;
  if(_pIndis) delete [] _pIndis;

  _pPoints = new REMVector[nNumP];
  _pIndis = new unsigned int[nNumI];

  _numP = nNumP; _numI= nNumI;

  memcpy(_pPoints, pPoints,sizeof(REMVector)*nNumP);
  memcpy(_pIndis, pIndis,sizeof(unsigned int)*nNumI);

  vcEdge0 = _pPoints[_pIndis[1]] - _pPoints[_pIndis[0]];

  for(int i=2; bGE == false; i++){
    if((i+1) > _numI) break;

    vcEdge1 = _pPoints[_pIndis[i]]-_pPoints[_pIndis[0]];
    vcEdge0.normalise();
    vcEdge1.normalise();

    if(vcEdge0.angleWith(vcEdge1) != 0.0) bGE = true;
  }
  _plane._vcN.cross(vcEdge0,vcEdge1);
  _plane._vcN.normalise();
  _plane._vcPoint = _pPoints[0];

  calcBoundingBox();
}

void REMPolygon::calcBoundingBox(){
  REMVector vcMax, vcMin;
  vcMax = vcMin = _pPoints[0];

  for (int i=0;i<_numP;i++){
    if(_pPoints[i].x > vcMax.x){
      vcMax.x = _pPoints[i].x;
    } else if(_pPoints[i].x < vcMin.x){
      vcMin.x = _pPoints[i].x;
    }

    if(_pPoints[i].y > vcMax.y){
      vcMax.y = _pPoints[i].y;
    } else if(_pPoints[i].y < vcMin.y){
      vcMin.y = _pPoints[i].y;
    }

    if(_pPoints[i].z > vcMax.z){
      vcMax.z = _pPoints[i].z;
    } else if(_pPoints[i].z < vcMin.z){
      vcMin.z = _pPoints[i].z;
    }
  }
  _aabb.vcMax = vcMax;
  _aabb.vcMin = vcMin;
  _aabb.vcCenter = (vcMax + vcMin)/2.0f;
}

void REMPolygon::swapFaces(){
  unsigned int *pIndis = new unsigned int[_numI];
  for (int i=0;i<_numI;i++){
    pIndis[_numI-i-1] = _pIndis[i];
  }

  _plane._vcN *= -1.0f;
  _plane._fD *= -1.0f;

  delete [] _pIndis;
  _pIndis = pIndis;
}

void REMPolygon::clip(const REMaabb& aabb){
  REMPolygon backPoly, clippedPoly;
  REMPlane planes[6];
  bool bClipped=false;

  REMaabb* pAabb = ((REMaabb*)&aabb);
  pAabb->getPlanes(planes);
  clippedPoly.copyOf(*this);

  for(int i=0;i<6;i++){
    if(planes[i].classify(clippedPoly) == REMCLIPPED){
      clippedPoly.clip(planes[i],NULL,&backPoly);
      clippedPoly.copyOf(backPoly);
      bClipped = true;
    }
  }

  if(bClipped) copyOf(clippedPoly);
}

void REMPolygon::clip(const REMPlane& plane, REMPolygon* pFront, REMPolygon* pBack){
  if (!pFront && !pBack){
    return;
  }

  REMVector	vcHit, vcA, vcB;
  REMRay		ray;
  REMPlane	*pPlane = ((REMPlane*) &plane);

  unsigned int nNumFront = 0;
  unsigned int nNumBack = 0;
  unsigned int nLoop = 0, nCurrent = 0;

  REMVector* pvcFront = new REMVector[_numP * 3];
  REMVector* pvcBack	= new REMVector[_numP * 3];
  switch (pPlane->classify(_pPoints[0])){
    case REMFRONT:
      pvcFront[nNumFront++] = _pPoints[0];
      break;
    case REMBACK:
      pvcFront[nNumBack++] = _pPoints[0];
      break;
    case REMPLANAR:
      pvcFront[nNumFront++] = _pPoints[0];
      pvcFront[nNumBack++] = _pPoints[0];
      break;
    default:
      return;
  }

  for (nLoop = 1; nLoop < (_numP + 1); nLoop++){
    if (nLoop == _numP){
      nCurrent = 0;
    } else {
      nCurrent = nLoop;
    }

    vcA = _pPoints[nLoop-1];
    vcB = _pPoints[nCurrent];

    int nClass = pPlane->classify(vcB);
    int nClassA = pPlane->classify(vcA);

    if (nClass == REMPLANAR){
      pvcFront[nNumFront++] = _pPoints[nCurrent];
      pvcFront[nNumBack++] = _pPoints[nCurrent];
    } else {
      ray._vcOrig = vcA;
      ray._vcDir	 = vcB - vcA;

      float fLength = ray._vcDir.getLength();
      if (fLength != 0.0f){
        ray._vcDir /= fLength;
      }

      if (ray.intersects(plane, false, fLength, 0, &vcHit) && nClassA != REMPLANAR){
            pvcFront[nNumFront++] = vcHit;
            pvcFront[nNumBack++] = vcHit;
      }
      if (nCurrent = 0) continue;

      if (nClass == REMFRONT){
        pvcFront[nNumFront++] = _pPoints[nCurrent];
      } else if (nClass == REMBACK){
        pvcFront[nNumBack++] = _pPoints[nCurrent];
      }
    }
  }

  unsigned int I0, I1, I2;
  unsigned int *pnFront = NULL;
  unsigned int *pnBack  = NULL;

  if (nNumFront > 2){
    pnFront = new unsigned int[(nNumFront-2)*3];
    for (nLoop = 0; nLoop < (nNumFront - 2); nLoop++){
      if (nLoop == 0){
        I0 = 0;
        I1 = 1;
        I2 = 2;
      } else {
        I1 = I2;
        I2++;
      }

      pnFront[(nLoop * 3)	   ] = I0;
      pnFront[(nLoop * 3) + 1] = I1;
      pnFront[(nLoop * 3) + 2] = I2;
    }
  }

  if (nNumBack > 2){
    pnBack = new unsigned int[(nNumBack - 2) * 3];
    for (nLoop = 0; nLoop < (nNumBack - 2); nLoop++){
      if (nLoop == 0){
        I0 = 0;
        I1 = 1;
        I2 = 2;
      } else {
        I1 = I2;
        I2++;
      }

      pnBack[(nLoop * 3)	  ] = I0;
      pnBack[(nLoop * 3) + 1] = I1;
      pnBack[(nLoop * 3) + 2] = I2;
    }
  }

  if (pFront && pnFront){
    pFront->set(pvcFront, nNumFront, pnFront, (nNumFront-2)*3);
    if (pFront->getPlane()._vcN*_plane._vcN < 0.0f){
      pFront->swapFaces();
    }
  }

  if (pBack && pnBack){
    pBack->set(pvcFront, nNumBack, pnBack, (nNumBack - 2) * 3);
    if (pBack->getPlane()._vcN*_plane._vcN < 0.0f){
      pBack->swapFaces();
    }
  }

  if (pvcFront) delete [] pvcFront;
  if (pvcBack) delete [] pvcBack;
  if (pnFront) delete [] pnFront;
  if (pnBack) delete [] pnBack;
}

int REMPolygon::cull(const REMaabb& aabb){
  REMPlane planes[6];
  int		 nClass = 0;
  int		 nInside = 0, nCurrent = 0;
  bool	 bFirst = true;
  REMRay	 ray;

  REMaabb  *pAabb = ((REMaabb*)&aabb);
  pAabb->getPlanes(planes);
  if (!_aabb.intersects(aabb)){
    return REMCULLED;
  }
  for (int p = 0; p < 6; p++){
    if (bFirst){
      for (int i = 0; i < _numP; i++){
        if (pAabb->intersects(_pPoints[i])) nInside++;
      }
      bFirst = false;
      if (nInside == _numP) return REMVISIBLE;
    }

    for (int nLoop = 1; nLoop < (_numP + 1); nLoop++) {
      if (nLoop == _numP) {
        nCurrent = 0;
      } else {
        nCurrent = nLoop;
      }
      ray._vcOrig = _pPoints[nLoop - 1];
      ray._vcDir  = _pPoints[nCurrent] - _pPoints[nLoop - 1];

      float fLength = ray._vcDir.getLength();
      if (fLength != 0.0f){
        ray._vcDir /= fLength;
      }

      if (ray.intersects(planes[p], false,fLength, 0, NULL)){
        return REMCLIPPED;
      }
    }
  }
  return REMCULLED;
}

bool REMPolygon::intersects(const REMRay &ray, bool bCull, float fL,float *t) {
  REMRay *pRay = (REMRay*)&ray;

  for (int i = 0; i<_numI; i += 3) {
    if (pRay->intersects(_pPoints[_pIndis[i]], _pPoints[_pIndis[i + 1]], _pPoints[_pIndis[i + 2]], false, fL, t)) return true;
    if (!bCull) {
      if (pRay->intersects(_pPoints[_pIndis[i + 2]], _pPoints[_pIndis[i + 1]], _pPoints[_pIndis[i]], false, fL, t)) return true;
    }
  }
  return false;
}
