#ifndef REM4D_H
#define REM4D_H
#include <cmath>
#include <string.h>
#include <math.h>
#include "rem3d.h"

class REMQuat{
public:
  float x, y, z, w;
  REMQuat();
  REMQuat(float _x, float _y, float _z, float _w);
  void  createFromEuler(float fPitch, float fYaw, float fRoll);
  void  normalize();
  void  conjugate(REMQuat q);
  void  getEulers(float *fPitch, float *fYaw, float *fRoll);
  void  getMatrix(REMMatrix* m);
  float getMagnitude();
  void    operator /= (float f);
  REMQuat operator /  (float f);
  void    operator *= (float f);
  REMQuat operator *  (float f);
  REMQuat operator *  (const REMVector& v) const;
  REMQuat operator *	(const REMQuat& q)const;
  void	operator *= (const REMQuat& q);
  void    operator += (const REMQuat& q);
  REMQuat operator +  (const REMQuat& q) const;
  REMQuat operator~(void) const { return REMQuat(-x, -y, -z, w); }
  void rotate(const REMQuat& q1, const REMQuat& q2);
  REMVector rotate(const REMVector& v);
};
#endif
