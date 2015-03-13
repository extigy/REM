#ifndef REMINPUT_H
#define REMINPUT_H
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include "const.h"
#include <html5.h>

typedef struct MOUSEINFOTYPE{
  bool mouseDown[3];
  bool pointerLocked;
  long mouseX;
  long mouseY;
  long movementX;
  long movementY;
} mI;


class REMKeyboard {
private:
  bool keyDown[512];
  void log(char* chString,...);
public:
  REMKeyboard();
  ~REMKeyboard();
  void init();
  bool isKeyPressed(unsigned int key);
};

class REMMouse {
private:
   mI _mouseInfo;
  void log(char* chString,...);
public:
  REMMouse();
  ~REMMouse();
  void init();
  mI getMouseInfo();
  bool isKeyPressed(unsigned int key);
  POINT getMovement();
};


class REMInputManager{
public:
  bool _bRunning;
  REMKeyboard* keyboard;
  REMMouse* mouse;
public:
  REMInputManager();
  ~REMInputManager();
  int init();
  void release();
  bool isPointerLocked();
  int getPosition(REMInputType,POINT*);
  bool isPressed(REMInputType, unsigned int);
  bool isReleased(REMInputType, unsigned int);
};




#endif
