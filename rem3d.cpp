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
  vResult.x = x*m._data[0][0] + y*m._data[1][0] + z*m._data[2][0] + m._data[3][0];
  vResult.y = x*m._data[0][1] + y*m._data[1][1] + z*m._data[2][1] + m._data[3][1];
  vResult.z = x*m._data[0][2] + y*m._data[1][2] + z*m._data[2][2] + m._data[3][2];
  vResult.w = x*m._data[0][3] + y*m._data[1][3] + z*m._data[2][3] + m._data[3][3];

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
  z = u.x*v.y - v.y*u.x;
  w = 1.0f;
};

REMMatrix::REMMatrix(){
};
void REMMatrix::identity(){
  float* f = &(_data[0][0]);
  memset(f,0,sizeof(float)*16);
  _data[0][0] = _data[1][1] = _data[2][2] = _data[3][3] = 1.0f;
};
void REMMatrix::rotaX(float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  _data[1][1] = fCos;
  _data[1][2] = fSin;
  _data[2][1] = -fSin;
  _data[2][2] = fCos;
  _data[0][0] = _data[3][3] = 1.0f;
  _data[0][1]=_data[0][2]=_data[0][3]=_data[1][0]=_data[1][3]=_data[2][0]=_data[2][3]=_data[3][0]=_data[3][1]=_data[3][2]=0.0f;
};
void REMMatrix::rotaY(float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  _data[0][0] = fCos;
  _data[0][2] = -fSin;
  _data[2][0] = fSin;
  _data[2][2] = fCos;
  _data[1][1] = _data[3][3] = 1.0f;
  _data[0][1]=_data[1][2]=_data[0][3]=_data[1][0]=_data[1][3]=_data[2][1]=_data[2][3]=_data[3][0]=_data[3][1]=_data[3][2]=0.0f;
};
void REMMatrix::rotaZ(float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  _data[0][0] = fCos;
  _data[0][1] = fSin;
  _data[1][0] = -fSin;
  _data[1][1] = fCos;
  _data[2][2] = _data[3][3] = 1.0f;
  _data[0][2]=_data[0][3]=_data[1][2]=_data[1][3]=_data[2][0]=_data[2][1]=_data[2][3]=_data[3][0]=_data[3][1]=_data[3][2]=0.0f;
};
void REMMatrix::rotaArbi(REMVector& vcAxis, float a){
  float fCos = cosf(a);
  float fSin = sinf(a);
  float fSum = 1.0f - fCos;

  vcAxis.normalise();

  _data[0][0] = (vcAxis.x*vcAxis.x)*fSum + fCos;
  _data[0][1] = (vcAxis.x*vcAxis.y)*fSum - (vcAxis.z*fSin);
  _data[0][2] = (vcAxis.x*vcAxis.z)*fSum + (vcAxis.y*fSin);
  _data[1][0] = (vcAxis.y*vcAxis.x)*fSum + (vcAxis.z*fSin);
  _data[1][1] = (vcAxis.y*vcAxis.y)*fSum + fCos;
  _data[1][2] = (vcAxis.y*vcAxis.z)*fSum - (vcAxis.x*fSin);
  _data[2][0] = (vcAxis.z*vcAxis.x)*fSum - (vcAxis.y*fSin);
  _data[2][1] = (vcAxis.z*vcAxis.y)*fSum + (vcAxis.x*fSin);
  _data[2][2] = (vcAxis.z*vcAxis.z)*fSum + fCos;

  _data[3][0] = _data[1][3] = _data[2][3] = _data[3][0] = _data[3][1] = _data[3][2] = 0.0f;
  _data[3][3] = 1.0f;
};
void REMMatrix::translate(float dx, float dy, float dz){
  _data[3][0] = dx;
  _data[3][1] = dy;
  _data[3][2] = dz;
};

void REMMatrix::transposeOf(const REMMatrix& m){
  _data[0][0] = m._data[0][0];
  _data[1][0] = m._data[0][1];
  _data[2][0] = m._data[0][2];
  _data[3][0] = m._data[0][3];
  _data[0][1] = m._data[1][0];
  _data[1][1] = m._data[1][1];
  _data[2][1] = m._data[1][2];
  _data[3][1] = m._data[1][3];
  _data[0][2] = m._data[2][0];
  _data[1][2] = m._data[2][1];
  _data[2][2] = m._data[2][2];
  _data[3][2] = m._data[2][3];
  _data[0][3] = m._data[3][0];
  _data[1][3] = m._data[3][1];
  _data[2][3] = m._data[3][2];
  _data[3][3] = m._data[3][3];
};
void REMMatrix::inverseOf(const REMMatrix& m) {
  REMMatrix mTrans;
  float     fTemp[12],
  fDet;

  mTrans.transposeOf(m);

  fTemp[0] = mTrans._data[2][2] * mTrans._data[3][3];
  fTemp[1] = mTrans._data[2][3] * mTrans._data[3][2];
  fTemp[2] = mTrans._data[2][1] * mTrans._data[3][3];
  fTemp[3] = mTrans._data[2][3] * mTrans._data[3][1];
  fTemp[4] = mTrans._data[2][1] * mTrans._data[3][2];
  fTemp[5] = mTrans._data[2][2] * mTrans._data[3][1];
  fTemp[6] = mTrans._data[2][0] * mTrans._data[3][3];
  fTemp[7] = mTrans._data[2][3] * mTrans._data[3][0];
  fTemp[8] = mTrans._data[2][0] * mTrans._data[3][2];
  fTemp[9] = mTrans._data[2][2] * mTrans._data[3][0];
  fTemp[10] = mTrans._data[2][0] * mTrans._data[3][1];
  fTemp[11] = mTrans._data[2][1] * mTrans._data[3][0];

  this->_data[0][0] = fTemp[0] * mTrans._data[1][1] + fTemp[3] * mTrans._data[1][2] + fTemp[4] * mTrans._data[1][3];
  this->_data[0][0] -= fTemp[1] * mTrans._data[1][1] + fTemp[2] * mTrans._data[1][2] + fTemp[5] * mTrans._data[1][3];
  this->_data[0][1] = fTemp[1] * mTrans._data[1][0] + fTemp[6] * mTrans._data[1][2] + fTemp[9] * mTrans._data[1][3];
  this->_data[0][1] -= fTemp[0] * mTrans._data[1][0] + fTemp[7] * mTrans._data[1][2] + fTemp[8] * mTrans._data[1][3];
  this->_data[0][2] = fTemp[2] * mTrans._data[1][0] + fTemp[7] * mTrans._data[1][1] + fTemp[10] * mTrans._data[1][3];
  this->_data[0][2] -= fTemp[3] * mTrans._data[1][0] + fTemp[6] * mTrans._data[1][1] + fTemp[11] * mTrans._data[1][3];
  this->_data[0][3] = fTemp[5] * mTrans._data[1][0] + fTemp[8] * mTrans._data[1][1] + fTemp[11] * mTrans._data[1][2];
  this->_data[0][3] -= fTemp[4] * mTrans._data[1][0] + fTemp[9] * mTrans._data[1][1] + fTemp[10] * mTrans._data[1][2];
  this->_data[1][0] = fTemp[1] * mTrans._data[0][1] + fTemp[2] * mTrans._data[0][2] + fTemp[5] * mTrans._data[0][3];
  this->_data[1][0] -= fTemp[0] * mTrans._data[0][1] + fTemp[3] * mTrans._data[0][2] + fTemp[4] * mTrans._data[0][3];
  this->_data[1][1] = fTemp[0] * mTrans._data[0][0] + fTemp[7] * mTrans._data[0][2] + fTemp[8] * mTrans._data[0][3];
  this->_data[1][1] -= fTemp[1] * mTrans._data[0][0] + fTemp[6] * mTrans._data[0][2] + fTemp[9] * mTrans._data[0][3];
  this->_data[1][2] = fTemp[3] * mTrans._data[0][0] + fTemp[6] * mTrans._data[0][1] + fTemp[11] * mTrans._data[0][3];
  this->_data[1][2] -= fTemp[2] * mTrans._data[0][0] + fTemp[7] * mTrans._data[0][1] + fTemp[10] * mTrans._data[0][3];
  this->_data[1][3] = fTemp[4] * mTrans._data[0][0] + fTemp[9] * mTrans._data[0][1] + fTemp[10] * mTrans._data[0][2];
  this->_data[1][3] -= fTemp[5] * mTrans._data[0][0] + fTemp[8] * mTrans._data[0][1] + fTemp[11] * mTrans._data[0][2];

  fTemp[0] = mTrans._data[0][2] * mTrans._data[1][3];
  fTemp[1] = mTrans._data[0][3] * mTrans._data[1][2];
  fTemp[2] = mTrans._data[0][1] * mTrans._data[1][3];
  fTemp[3] = mTrans._data[0][3] * mTrans._data[1][1];
  fTemp[4] = mTrans._data[0][1] * mTrans._data[1][2];
  fTemp[5] = mTrans._data[0][2] * mTrans._data[1][1];
  fTemp[6] = mTrans._data[0][0] * mTrans._data[1][3];
  fTemp[7] = mTrans._data[0][3] * mTrans._data[1][0];
  fTemp[8] = mTrans._data[0][0] * mTrans._data[1][2];
  fTemp[9] = mTrans._data[0][2] * mTrans._data[1][0];
  fTemp[10] = mTrans._data[0][0] * mTrans._data[1][1];
  fTemp[11] = mTrans._data[0][1] * mTrans._data[1][0];

  this->_data[2][0] = fTemp[0] * mTrans._data[3][1] + fTemp[3] * mTrans._data[3][2] + fTemp[4] * mTrans._data[3][3];
  this->_data[2][0] -= fTemp[1] * mTrans._data[3][1] + fTemp[2] * mTrans._data[3][2] + fTemp[5] * mTrans._data[3][3];
  this->_data[2][1] = fTemp[1] * mTrans._data[3][0] + fTemp[6] * mTrans._data[3][2] + fTemp[9] * mTrans._data[3][3];
  this->_data[2][1] -= fTemp[0] * mTrans._data[3][0] + fTemp[7] * mTrans._data[3][2] + fTemp[8] * mTrans._data[3][3];
  this->_data[2][2] = fTemp[2] * mTrans._data[3][0] + fTemp[7] * mTrans._data[3][1] + fTemp[10] * mTrans._data[3][3];
  this->_data[2][2] -= fTemp[3] * mTrans._data[3][0] + fTemp[6] * mTrans._data[3][1] + fTemp[11] * mTrans._data[3][3];
  this->_data[2][3] = fTemp[5] * mTrans._data[3][0] + fTemp[8] * mTrans._data[3][1] + fTemp[11] * mTrans._data[3][2];
  this->_data[2][3] -= fTemp[4] * mTrans._data[3][0] + fTemp[9] * mTrans._data[3][1] + fTemp[10] * mTrans._data[3][2];
  this->_data[3][0] = fTemp[2] * mTrans._data[2][2] + fTemp[5] * mTrans._data[2][3] + fTemp[1] * mTrans._data[2][1];
  this->_data[3][0] -= fTemp[4] * mTrans._data[2][3] + fTemp[0] * mTrans._data[2][1] + fTemp[3] * mTrans._data[2][2];
  this->_data[3][1] = fTemp[8] * mTrans._data[2][3] + fTemp[0] * mTrans._data[2][0] + fTemp[7] * mTrans._data[2][2];
  this->_data[3][1] -= fTemp[6] * mTrans._data[2][2] + fTemp[9] * mTrans._data[2][3] + fTemp[1] * mTrans._data[2][0];
  this->_data[3][2] = fTemp[6] * mTrans._data[2][1] + fTemp[11] * mTrans._data[2][3] + fTemp[3] * mTrans._data[2][0];
  this->_data[3][2] -= fTemp[10] * mTrans._data[2][3] + fTemp[2] * mTrans._data[2][0] + fTemp[7] * mTrans._data[2][1];
  this->_data[3][3] = fTemp[10] * mTrans._data[2][2] + fTemp[4] * mTrans._data[2][0] + fTemp[9] * mTrans._data[2][1];
  this->_data[3][3] -= fTemp[8] * mTrans._data[2][1] + fTemp[11] * mTrans._data[2][2] + fTemp[5] * mTrans._data[2][0];

  fDet = mTrans._data[0][0]*this->_data[0][0] +
  mTrans._data[0][1]*this->_data[0][1] +
  mTrans._data[0][2]*this->_data[0][2] +
  mTrans._data[0][3]*this->_data[0][3];

  fDet = 1 / fDet;

  this->_data[0][0] *= fDet;
  this->_data[0][1] *= fDet;
  this->_data[0][2] *= fDet;
  this->_data[0][3] *= fDet;

  this->_data[1][0] *= fDet;
  this->_data[1][1] *= fDet;
  this->_data[1][2] *= fDet;
  this->_data[1][3] *= fDet;

  this->_data[2][0] *= fDet;
  this->_data[2][1] *= fDet;
  this->_data[2][2] *= fDet;
  this->_data[2][3] *= fDet;

  this->_data[3][0] *= fDet;
  this->_data[3][1] *= fDet;
  this->_data[3][2] *= fDet;
  this->_data[3][3] *= fDet;
}

REMMatrix REMMatrix::operator * (const REMMatrix& m) const {
  REMMatrix mResult;
  mResult.identity();

  mResult._data[0][0] = _data[0][0]*m._data[0][0] + _data[0][1]*m._data[1][0] + _data[0][2]*m._data[3][0] + _data[0][3]*m._data[3][0];
  mResult._data[0][1] = _data[0][0]*m._data[0][1] + _data[0][1]*m._data[1][1] + _data[0][2]*m._data[3][1] + _data[0][3]*m._data[3][1];
  mResult._data[0][2] = _data[0][0]*m._data[0][2] + _data[0][1]*m._data[1][2] + _data[0][2]*m._data[3][2] + _data[0][3]*m._data[3][2];
  mResult._data[0][3] = _data[0][0]*m._data[0][3] + _data[0][1]*m._data[1][3] + _data[0][2]*m._data[3][3] + _data[0][3]*m._data[3][3];

  mResult._data[1][0] = _data[1][0]*m._data[0][0] + _data[1][1]*m._data[1][0] + _data[1][2]*m._data[3][0] + _data[1][3]*m._data[3][0];
  mResult._data[1][1] = _data[1][0]*m._data[0][1] + _data[1][1]*m._data[1][1] + _data[1][2]*m._data[3][1] + _data[1][3]*m._data[3][1];
  mResult._data[1][2] = _data[1][0]*m._data[0][2] + _data[1][1]*m._data[1][2] + _data[1][2]*m._data[3][2] + _data[1][3]*m._data[3][2];
  mResult._data[1][3] = _data[1][0]*m._data[0][3] + _data[1][1]*m._data[1][3] + _data[1][2]*m._data[3][3] + _data[1][3]*m._data[3][3];

  mResult._data[2][0] = _data[2][0]*m._data[0][0] + _data[2][1]*m._data[1][0] + _data[2][2]*m._data[3][0] + _data[2][3]*m._data[3][0];
  mResult._data[2][1] = _data[2][0]*m._data[0][1] + _data[2][1]*m._data[1][1] + _data[2][2]*m._data[3][1] + _data[2][3]*m._data[3][1];
  mResult._data[2][2] = _data[2][0]*m._data[0][2] + _data[2][1]*m._data[1][2] + _data[2][2]*m._data[3][2] + _data[2][3]*m._data[3][2];
  mResult._data[2][3] = _data[2][0]*m._data[0][3] + _data[2][1]*m._data[1][3] + _data[2][2]*m._data[3][3] + _data[2][3]*m._data[3][3];

  mResult._data[3][0] = _data[3][0]*m._data[0][0] + _data[3][1]*m._data[1][0] + _data[3][2]*m._data[3][0] + _data[3][3]*m._data[3][0];
  mResult._data[3][1] = _data[3][0]*m._data[0][1] + _data[3][1]*m._data[1][1] + _data[3][2]*m._data[3][1] + _data[3][3]*m._data[3][1];
  mResult._data[3][2] = _data[3][0]*m._data[0][2] + _data[3][1]*m._data[1][2] + _data[3][2]*m._data[3][2] + _data[3][3]*m._data[3][2];
  mResult._data[3][3] = _data[3][0]*m._data[0][3] + _data[3][1]*m._data[1][3] + _data[3][2]*m._data[3][3] + _data[3][3]*m._data[3][3];

  return mResult;
}

REMVector REMMatrix::operator * (const REMVector& vc) const{
  REMVector vcResult;
  vcResult.x = vc.x*_data[0][0] + vc.y*_data[1][0] + vc.z*_data[2][0] + _data[3][0];
  vcResult.y = vc.x*_data[0][1] + vc.y*_data[1][1] + vc.z*_data[2][1] + _data[3][1];
  vcResult.z = vc.x*_data[0][2] + vc.y*_data[1][2] + vc.z*_data[2][2] + _data[3][2];
  vcResult.w = vc.x*_data[0][3] + vc.y*_data[1][3] + vc.z*_data[2][3] + _data[3][3];

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

  _data[0][0] = vcRight.x; _data[1][0] = vcUp.x; _data[2][0] = vcDir.x;
  _data[0][1] = vcRight.y; _data[1][1] = vcUp.y; _data[2][1] = vcDir.y;
  _data[0][2] = vcRight.z; _data[1][2] = vcUp.z; _data[2][2] = vcDir.z;

  _data[3][0] = vcPos.x;
  _data[3][1] = vcPos.y;
  _data[3][2] = vcPos.z;

  _data[0][3] = 0.0f; _data[1][3] = 0.0f; _data[2][3] = 0.0f; _data[3][3] = 1.0f;
}

void REMMatrix::billboard(REMVector vcPos, REMVector vcDir, REMVector vcWorldUp) {
  REMVector vcUp, vcRight;
  float     fAngle = 0.0f;

  fAngle = vcWorldUp * vcDir;

  vcUp = vcWorldUp - (vcDir * fAngle);
  vcUp.normalise();

  vcRight.cross(vcUp, vcDir);

  _data[0][0] = vcRight.x; _data[1][0] = vcUp.x; _data[2][0] = vcDir.x;
  _data[0][1] = vcRight.y; _data[1][1] = vcUp.y; _data[2][1] = vcDir.y;
  _data[0][2] = vcRight.z; _data[1][2] = vcUp.z; _data[2][2] = vcDir.z;

  _data[3][0] = vcPos.x;
  _data[3][1] = vcPos.y;
  _data[3][2] = vcPos.z;

  _data[0][3] = 0.0f; _data[1][3] = 0.0f; _data[2][3] = 0.0f; _data[3][3] = 1.0f;
}
