#include "rem3d.h"
#include "const.h"

REMVector::REMVector(void){
  x=0;
  y=0;
  z=0;
  w=1.0f;
}
REMVector::REMVector(float _x, float _y, float _z){
  x=_x;
  y=_y;
  z=_z;
  w=1.0f;
}

void REMVector::set(float _x, float _y, float _z,float _w){
  x=_x;
  y=_y;
  z=_z;
  w=_w;
};
float REMVector::getLength(){
  return (float)sqrt(x*x+y*y+z*z);
};
float REMVector::getSqrLength(){
  return (x*x+y*y+z*z);
};

void REMVector::negate(){
  x = -x;
  y = -y;
  x = -z;
};

void REMVector::normalise(){
  float f =  (float)sqrt(x*x+y*y+z*z);
  if(f!=0){
    x/=f;
    y/=f;
    z/=f;
  }
};

float REMVector::angleWith(REMVector& v){
  return (float)acos( ((*this)*v)/(this->getLength()*v.getLength()) );
};

void REMVector::difference(const REMVector& u, const REMVector& v){
  x = u.x - v.x;
  y = u.y - v.y;
  z = u.z - v.z;
  w = 1.0f;
};

void REMVector::operator += (const REMVector& v){
  x += v.x;
  y += v.y;
  z += v.z;
};

void REMVector::operator -= (const REMVector& v){
  x -= v.x;
  y -= v.y;
  z -= v.z;
};
void REMVector::operator *= (float f){
  x *= f;
  y *= f;
  z *= f;
};
void REMVector::operator /= (float f){
  x /= f;
  y /= f;
  z /= f;
};
float REMVector::operator * (const REMVector& v) const{
  return (x*v.x+y*v.y+z*v.z);
};
REMVector REMVector::operator * (float f) const{
  return REMVector(x*f,y*f,z*f);
};
REMVector REMVector::operator / (float f) const{
  return REMVector(x/f,y/f,z/f);
};
REMVector REMVector::operator * (REMMatrix& m) const{
  REMVector vResult;
  vResult.x = x*m._11 + y*m._21 + z*m._31 + m._41;
  vResult.y = x*m._12 + y*m._22 + z*m._32 + m._42;
  vResult.z = x*m._13 + y*m._23 + z*m._33 + m._43;
  vResult.w = x*m._14 + y*m._24 + z*m._34 + m._44;

  vResult.x = vResult.x/vResult.w;
  vResult.y = vResult.y/vResult.w;
  vResult.z = vResult.z/vResult.w;
  vResult.w = 1.0f;

  return vResult;
};
REMVector REMVector::operator + (const REMVector& v) const{
  return REMVector(x+v.x,y+v.y,z+v.z);
};
REMVector REMVector::operator - (const REMVector& v) const{
  return REMVector(x-v.x,y-v.y,z-v.z);
};
void REMVector::cross (const REMVector& u, const REMVector& v){
  x = u.y*v.z - u.z*v.y;
  y = u.z*v.x - u.x*v.z;
  z = u.x*v.y - u.y*v.x;
  w = 1.0f;
};

REMMatrix::REMMatrix(){
};
void REMMatrix::identity(){
  float* f = &(_11);
  memset(f,0,sizeof(float)*16);
  _11 = _22 = _33 = _44 = 1.0f;
};
void REMMatrix::rotaX(float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  _22 = fCos;
  _23 = fSin;
  _32 = -fSin;
  _33 = fCos;
  _11 = _44 = 1.0f;
  _12=_13=_14=_21=_24=_31=_34=_41=_42=_43=0.0f;
};
void REMMatrix::rotaY(float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  _11 = fCos;
  _13 = -fSin;
  _31 = fSin;
  _33 = fCos;
  _22 = _44 = 1.0f;
  _12=_23=_14=_21=_24=_32=_34=_41=_42=_43=0.0f;
};
void REMMatrix::rotaZ(float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  _11 = fCos;
  _12 = fSin;
  _21 = -fSin;
  _22 = fCos;
  _33 = _44 = 1.0f;
  _13=_14=_23=_24=_31=_32=_34=_41=_42=_43=0.0f;
};
void REMMatrix::rotaArbi(REMVector& vcAxis, float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  float fSum = 1.0f - fCos;

  vcAxis.normalise();

  _11 = (vcAxis.x*vcAxis.x)*fSum + fCos;
  _12 = (vcAxis.x*vcAxis.y)*fSum - (vcAxis.z*fSin);
  _13 = (vcAxis.x*vcAxis.z)*fSum + (vcAxis.y*fSin);
  _21 = (vcAxis.y*vcAxis.x)*fSum + (vcAxis.z*fSin);
  _22 = (vcAxis.y*vcAxis.y)*fSum + fCos;
  _23 = (vcAxis.y*vcAxis.z)*fSum - (vcAxis.x*fSin);
  _31 = (vcAxis.z*vcAxis.x)*fSum - (vcAxis.y*fSin);
  _32 = (vcAxis.z*vcAxis.y)*fSum + (vcAxis.x*fSin);
  _33 = (vcAxis.z*vcAxis.z)*fSum + fCos;

  _41 = _24 = _34 = _41 = _42 = _43 = 0.0f;
  _44 = 1.0f;
};
void REMMatrix::translate(float dx, float dy, float dz){
  _41 += dx;
  _42 += dy;
  _43 += dz;
};

void REMMatrix::transposeOf(const REMMatrix& m){
  _11 = m._11;
  _21 = m._12;
  _31 = m._13;
  _41 = m._14;
  _12 = m._21;
  _22 = m._22;
  _32 = m._23;
  _42 = m._24;
  _13 = m._31;
  _23 = m._32;
  _33 = m._33;
  _43 = m._34;
  _14 = m._41;
  _24 = m._42;
  _34 = m._43;
  _44 = m._44;
};
void REMMatrix::inverseOf(const REMMatrix& m) {
  REMMatrix mTrans;
  float     fTemp[12],
  fDet;

  mTrans.transposeOf(m);

  fTemp[0] = mTrans._33 * mTrans._44;
  fTemp[1] = mTrans._34 * mTrans._43;
  fTemp[2] = mTrans._32 * mTrans._44;
  fTemp[3] = mTrans._34 * mTrans._42;
  fTemp[4] = mTrans._32 * mTrans._43;
  fTemp[5] = mTrans._33 * mTrans._42;
  fTemp[6] = mTrans._31 * mTrans._44;
  fTemp[7] = mTrans._34 * mTrans._41;
  fTemp[8] = mTrans._31 * mTrans._43;
  fTemp[9] = mTrans._33 * mTrans._41;
  fTemp[10] = mTrans._31 * mTrans._42;
  fTemp[11] = mTrans._32 * mTrans._41;

  this->_11 = fTemp[0] * mTrans._22 + fTemp[3] * mTrans._23 + fTemp[4] * mTrans._24;
  this->_11 -= fTemp[1] * mTrans._22 + fTemp[2] * mTrans._23 + fTemp[5] * mTrans._24;
  this->_12 = fTemp[1] * mTrans._21 + fTemp[6] * mTrans._23 + fTemp[9] * mTrans._24;
  this->_12 -= fTemp[0] * mTrans._21 + fTemp[7] * mTrans._23 + fTemp[8] * mTrans._24;
  this->_13 = fTemp[2] * mTrans._21 + fTemp[7] * mTrans._22 + fTemp[10] * mTrans._24;
  this->_13 -= fTemp[3] * mTrans._21 + fTemp[6] * mTrans._22 + fTemp[11] * mTrans._24;
  this->_14 = fTemp[5] * mTrans._21 + fTemp[8] * mTrans._22 + fTemp[11] * mTrans._23;
  this->_14 -= fTemp[4] * mTrans._21 + fTemp[9] * mTrans._22 + fTemp[10] * mTrans._23;
  this->_21 = fTemp[1] * mTrans._12 + fTemp[2] * mTrans._13 + fTemp[5] * mTrans._14;
  this->_21 -= fTemp[0] * mTrans._12 + fTemp[3] * mTrans._13 + fTemp[4] * mTrans._14;
  this->_22 = fTemp[0] * mTrans._11 + fTemp[7] * mTrans._13 + fTemp[8] * mTrans._14;
  this->_22 -= fTemp[1] * mTrans._11 + fTemp[6] * mTrans._13 + fTemp[9] * mTrans._14;
  this->_23 = fTemp[3] * mTrans._11 + fTemp[6] * mTrans._12 + fTemp[11] * mTrans._14;
  this->_23 -= fTemp[2] * mTrans._11 + fTemp[7] * mTrans._12 + fTemp[10] * mTrans._14;
  this->_24 = fTemp[4] * mTrans._11 + fTemp[9] * mTrans._12 + fTemp[10] * mTrans._13;
  this->_24 -= fTemp[5] * mTrans._11 + fTemp[8] * mTrans._12 + fTemp[11] * mTrans._13;

  fTemp[0] = mTrans._13 * mTrans._24;
  fTemp[1] = mTrans._14 * mTrans._23;
  fTemp[2] = mTrans._12 * mTrans._24;
  fTemp[3] = mTrans._14 * mTrans._22;
  fTemp[4] = mTrans._12 * mTrans._23;
  fTemp[5] = mTrans._13 * mTrans._22;
  fTemp[6] = mTrans._11 * mTrans._24;
  fTemp[7] = mTrans._14 * mTrans._21;
  fTemp[8] = mTrans._11 * mTrans._23;
  fTemp[9] = mTrans._13 * mTrans._21;
  fTemp[10] = mTrans._11 * mTrans._22;
  fTemp[11] = mTrans._12 * mTrans._21;

  this->_31 = fTemp[0] * mTrans._42 + fTemp[3] * mTrans._43 + fTemp[4] * mTrans._44;
  this->_31 -= fTemp[1] * mTrans._42 + fTemp[2] * mTrans._43 + fTemp[5] * mTrans._44;
  this->_32 = fTemp[1] * mTrans._41 + fTemp[6] * mTrans._43 + fTemp[9] * mTrans._44;
  this->_32 -= fTemp[0] * mTrans._41 + fTemp[7] * mTrans._43 + fTemp[8] * mTrans._44;
  this->_33 = fTemp[2] * mTrans._41 + fTemp[7] * mTrans._42 + fTemp[10] * mTrans._44;
  this->_33 -= fTemp[3] * mTrans._41 + fTemp[6] * mTrans._42 + fTemp[11] * mTrans._44;
  this->_34 = fTemp[5] * mTrans._41 + fTemp[8] * mTrans._42 + fTemp[11] * mTrans._43;
  this->_34 -= fTemp[4] * mTrans._41 + fTemp[9] * mTrans._42 + fTemp[10] * mTrans._43;
  this->_41 = fTemp[2] * mTrans._33 + fTemp[5] * mTrans._34 + fTemp[1] * mTrans._32;
  this->_41 -= fTemp[4] * mTrans._34 + fTemp[0] * mTrans._32 + fTemp[3] * mTrans._33;
  this->_42 = fTemp[8] * mTrans._34 + fTemp[0] * mTrans._31 + fTemp[7] * mTrans._33;
  this->_42 -= fTemp[6] * mTrans._33 + fTemp[9] * mTrans._34 + fTemp[1] * mTrans._31;
  this->_43 = fTemp[6] * mTrans._32 + fTemp[11] * mTrans._34 + fTemp[3] * mTrans._31;
  this->_43 -= fTemp[10] * mTrans._34 + fTemp[2] * mTrans._31 + fTemp[7] * mTrans._32;
  this->_44 = fTemp[10] * mTrans._33 + fTemp[4] * mTrans._31 + fTemp[9] * mTrans._32;
  this->_44 -= fTemp[8] * mTrans._32 + fTemp[11] * mTrans._33 + fTemp[5] * mTrans._31;

  fDet = mTrans._11*this->_11 +
  mTrans._12*this->_12 +
  mTrans._13*this->_13 +
  mTrans._14*this->_14;

  fDet = 1 / fDet;

  this->_11 *= fDet;
  this->_12 *= fDet;
  this->_13 *= fDet;
  this->_14 *= fDet;

  this->_21 *= fDet;
  this->_22 *= fDet;
  this->_23 *= fDet;
  this->_24 *= fDet;

  this->_31 *= fDet;
  this->_32 *= fDet;
  this->_33 *= fDet;
  this->_34 *= fDet;

  this->_41 *= fDet;
  this->_42 *= fDet;
  this->_43 *= fDet;
  this->_44 *= fDet;
}

REMMatrix REMMatrix::operator * (const REMMatrix& m) const {

  REMMatrix result;

  float *pThis	= (float*)this;
  float *pM		= (float*)&m;
  float *pResult	= (float*)&result;

  memset(pResult, 0, sizeof(REMMatrix));

  for ( int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++ ){
      pResult[4*i+j] += pThis[4*i]   * pM[j];
      pResult[4*i+j] += pThis[4*i+1] * pM[j+4];
      pResult[4*i+j] += pThis[4*i+2] * pM[j+8];
      pResult[4*i+j] += pThis[4*i+3] * pM[j+12];
    }
  }

  return result;
}

REMVector REMMatrix::operator * (const REMVector& vc) const{
  REMVector vcResult;
  vcResult.x = vc.x*_11 + vc.y*_21 + vc.z*_31 + _41;
  vcResult.y = vc.x*_12 + vc.y*_22 + vc.z*_32 + _42;
  vcResult.z = vc.x*_13 + vc.y*_23 + vc.z*_33 + _43;
  vcResult.w = vc.x*_14 + vc.y*_24 + vc.z*_34 + _44;

  vcResult.x = vcResult.x / vcResult.w;
  vcResult.y = vcResult.y / vcResult.w;
  vcResult.z = vcResult.z / vcResult.w;
  vcResult.w = 1.0f;

  return vcResult;
}

void REMMatrix::lookAt(REMVector vcPos, REMVector vcLookAt, REMVector vcWorldUp) {
  REMVector vcDir = vcLookAt - vcPos;
  REMVector vcUp, vcRight;
  float     fAngle = 0.0f;

  vcDir.normalise();

  fAngle = vcWorldUp * vcDir;

  vcUp = vcWorldUp - (vcDir * fAngle);
  vcUp.normalise();

  vcRight.cross(vcUp, vcDir);

  _11 = vcRight.x; _21 = vcUp.x; _31 = vcDir.x;
  _12 = vcRight.y; _22 = vcUp.y; _32 = vcDir.y;
  _13 = vcRight.z; _23 = vcUp.z; _33 = vcDir.z;

  _41 = vcPos.x;
  _42 = vcPos.y;
  _43 = vcPos.z;

  _14 = 0.0f; _24 = 0.0f; _34 = 0.0f; _44 = 1.0f;
}

void REMMatrix::billboard(REMVector vcPos, REMVector vcDir, REMVector vcWorldUp) {
  REMVector vcUp, vcRight;
  float     fAngle = 0.0f;

  fAngle = vcWorldUp * vcDir;

  vcUp = vcWorldUp - (vcDir * fAngle);
  vcUp.normalise();

  vcRight.cross(vcUp, vcDir);

  _11 = vcRight.x; _21 = vcUp.x; _31 = vcDir.x;
  _12 = vcRight.y; _22 = vcUp.y; _32 = vcDir.y;
  _13 = vcRight.z; _23 = vcUp.z; _33 = vcDir.z;

  _41 = vcPos.x;
  _42 = vcPos.y;
  _43 = vcPos.z;

  _14 = 0.0f; _24 = 0.0f; _34 = 0.0f; _44 = 1.0f;
}
