#ifndef REMINPUT_H
#define REMINPUT_H
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include "const.h"
#include <html5.h>

class REMKeyboard {
private:
  bool keyDown[512];
  void log(char* chString,...);
public:
  REMKeyboard();
  void init();
  bool isKeyPressed(unsigned int key);
};

class REMMouse {
private:
  bool mouseDown[3];
  double mouseDownTimestamp[3];
  long mouseX;
  long mouseY;
  long movementX;
  long movementY;
  void log(char* chString,...);
public:
  REMMouse();
  void init();
  bool isKeyPressed(unsigned int key);
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
  int getPosition(REMInputType,POINT*);
  bool isPressed(REMInputType, unsigned int);
  bool isReleased(REMInputType, unsigned int);
};




#endif
