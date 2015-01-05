#ifndef REM3D_H
#define REM3D_H
#include <cmath>
#include <string.h>
#include <math.h>

class REMMatrix;
class REMVector {
public:
  float x,y,z,w;
  REMVector();
  REMVector(float _x, float _y, float _z);
  void set(float _x, float _y, float _z,float _w=1.0f);
  float getLength();
  float getSqrLength();
  void negate();
  void normalise();
  float angleWith(REMVector& v);
  void difference(const REMVector& u, const REMVector& v);
  void operator += (const REMVector& v);
  void operator -= (const REMVector& v);
  void operator *= (float f);
  void operator /= (float f);
  float operator * (const REMVector& v) const;
  REMVector operator * (float f) const;
  REMVector operator / (float f) const;
  REMVector operator * (REMMatrix& m) const;
  REMVector operator + (const REMVector& v) const;
  REMVector operator - (const REMVector& v) const;
  void cross (const REMVector& u, const REMVector& v);
};

class REMMatrix{
public:
  //float _11,_12,_13,_14;
  //float _21,_22,_23,_24;
  //float _31,_32,_33,_34;
  //float _41,_42,_43,_44;

  float _data[4][4];

  REMMatrix();
  void identity();
  void rotaX(float a);
  void rotaY(float a);
  void rotaZ(float a);
  void rotaArbi(REMVector& vcAxis, float a);
  void translate(float dx, float dy, float dz);

  void transposeOf(const REMMatrix& m);
  void inverseOf(const REMMatrix& m);
  void billboard(REMVector vcPos, REMVector vcDir, REMVector vcWorldUp);
  void lookAt(REMVector vcPos, REMVector vcLookAt, REMVector vcWorldUp);

  REMMatrix operator * (const REMMatrix& m) const;
  REMVector operator * (const REMVector& vc) const;

};

#endif
