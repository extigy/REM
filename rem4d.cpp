#include "rem4d.h"
#include "const.h"

REMQuat::REMQuat() {
  x = 0.0f, y = 0.0f, z = 0.0f, w = 1.0f;
}

REMQuat::REMQuat(float _x, float _y, float _z, float _w) {
  x = _x; y = _y; z = _z; w = _w;
}

float REMQuat::getMagnitude(){
  return sqrt(x*x + y*y + z*z + w*w);
}

void REMQuat::normalize(){
  float m = getMagnitude();
  if (m != 0) {
    x /= m;
    y /= m;
    z /= m;
    w /= m;
  }
}

void REMQuat::conjugate(REMQuat q) {
  x = -q.x;
  y = -q.y;
  z = -q.z;
  w = q.w;
}

void REMQuat::rotate(const REMQuat& q1, const REMQuat& q2){
  REMQuat t = q1*q2*(~q1);
  x = t.x;
  y = t.y;
  z = t.z;
  w = t.w;
}

REMVector REMQuat::rotate(const REMVector& v) {
  REMQuat t(x, y, z, w);
  REMQuat r = t*v*(~t);
  return REMVector(r.x, r.y, r.z);
}

void REMQuat::createFromEuler(float fPitch, float fYaw, float fRoll){
  float cX, cY, cZ, sX, sY, sZ, cYcZ, sYsZ, cYsZ, sYcZ;

  fPitch	*= 0.5f;
  fYaw	*= 0.5f;
  fRoll	*= 0.5f;

  cX = cosf(fPitch);
  cY = cosf(fYaw);
  cZ = cosf(fRoll);

  sX = sinf(fPitch);
  sY = sinf(fYaw);
  sZ = sinf(fRoll);

  cYcZ = cY * cZ;
  sYsZ = sY * sZ;
  cYsZ = cY * sZ;
  sYcZ = sY * cZ;

  w = cX * cYcZ + sX * sYsZ;
  x = sX * cYcZ - cX * sYsZ;
  y = cX * sYcZ + sX * cYsZ;
  z = cX * cYsZ - sX * sYcZ;
}

void REMQuat::getMatrix(REMMatrix* m){
  float wx, wy, wz, xx, yy, yz, xy, xz, zz, x2, y2, z2;

  memset(m, 0, sizeof(REMMatrix));
  m->_data[3][3] = 1.0f;

  x2 = x + x;
  y2 = y + y;
  z2 = z + z;

  xx = x * x2;
  xy = x * y2;
  xz = x * z2;

  yy = y * y2;
  yz = y * z2;
  zz = z * z2;

  wx = w * x2;
  wy = w * y2;
  wz = w * z2;

  m->_data[0][0] = 1.0f - (yy + zz);
  m->_data[0][1] = xy - wz;
  m->_data[0][2] = xz + wy;

  m->_data[1][0] = xy + wz;
  m->_data[1][1] = 1.0f - (xx + zz);
  m->_data[1][2] = yz - wx;

  m->_data[2][0] = xz - wy;
  m->_data[2][1] = yz + wx;
  m->_data[2][2] = 1.0f - (xx + yy);
}

void REMQuat::getEulers(float *fPitch, float *fYaw, float *fRoll) {
  double   r11, r21, r31, r32, r33, r12, r13;
  double   q00, q11, q22, q33;
  double   tmp;

  q00 = w * w;
  q11 = x * x;
  q22 = y * y;
  q33 = z * z;

  r11 = q00 + q11 - q22 - q33;
  r21 = 2 * (x*y + w*z);
  r31 = 2 * (x*z - w*y);
  r32 = 2 * (y*z + w*x);
  r33 = q00 - q11 - q22 + q33;

  tmp = fabs(r31);
  if (tmp > 0.999999) {
    r12 = 2 * (x*y - w*z);
    r13 = 2 * (x*z + w*y);

    *fPitch = 0.0f;
    *fYaw = (float)-((M_PI / 2) * r31 / tmp);
    *fRoll = (float)atan2(-r12, -r31*r13);
  } else {
    *fPitch = (float)atan2(r32, r33);
    *fYaw = (float)asin(-r31);
    *fRoll = (float)atan2(r21, r11);
  }
}

void REMQuat::operator /= (float f){
  w /= f;
  x /= f;
  y /= f;
  z /= f;
}

REMQuat REMQuat::operator / (float f) {
  return REMQuat(x / f, y / f, z / f, w / f);
}

void REMQuat::operator *= (float f){
  w *= f;
  x *= f;
  y *= f;
  z *= f;
}

REMQuat REMQuat::operator * (float f) {
  return REMQuat(x*f, y*f, z*f, w*f);
}

void REMQuat::operator += (const REMQuat& q){
  w += q.w;
  x += q.x;
  y += q.y;
  z += q.z;
}

REMQuat REMQuat::operator + (const REMQuat& q) const {
  return REMQuat(x + q.x, y + q.y, z + q.z, w + q.w);
}

REMQuat REMQuat::operator * (const REMQuat& q) const{
  REMQuat qResult;

  qResult.w = w*q.w - x*q.x - y*q.y - z*q.z;
  qResult.x = w*q.x + x*q.w + y*q.z - z*q.y;
  qResult.y = w*q.y + y*q.w + z*q.x - x*q.z;
  qResult.z = w*q.z + z*q.w + x*q.y - y*q.x;

  return qResult;
}

void REMQuat::operator *= (const REMQuat& q){
  float _x, _y, _z, _w;

  _w = w*q.w - x*q.x - y*q.y - z*q.z;
  _x = w*q.x + x*q.w + y*q.z - z*q.y;
  _y = w*q.y + y*q.w + z*q.x - x*q.z;
  _z = w*q.z + z*q.w + x*q.y - y*q.x;

  x = _x;
  y = _y;
  z = _z;
  w = _w;
}

REMQuat REMQuat::operator * (const REMVector& v) const {
  return REMQuat(w*v.x + y*v.z - z*v.y, w*v.y + z*v.x - x*v.z, w*v.z + x*v.y - y*v.x,	-(x*v.x + y*v.y + z*v.z));
}
