#include "reminput.h"
#include "const.h"


REMInputManager::REMInputManager(){
  keyboard = new REMKeyboard();
  mouse = new REMMouse();
}
REMInputManager::~REMInputManager(){
  delete keyboard;
  delete mouse;
}

int REMInputManager::init(){
  keyboard->init();
  mouse->init();
}

bool REMInputManager::isPointerLocked(){
  return mouse->getMouseInfo().pointerLocked;
}

int REMInputManager::getPosition(REMInputType input,POINT* rPoint){
  switch(input){
    case IDV_MOUSE:
      if(rPoint) *rPoint = mouse->getMovement();
      break;
    default:
      printf("Input type not recognised!\n");
      return -1;
  }
  return 0;
}

bool REMInputManager::isPressed(REMInputType input, unsigned int key){
  switch(input){
    case IDV_KEYBOARD:
      return keyboard->isKeyPressed(key);
    case IDV_MOUSE:
      return mouse->isKeyPressed(key);
    break;
  default:
    printf("Input type not recognised!\n");
  }
  return false;
}

static inline const char *emscripten_event_type_to_string(int eventType) {
  const char *events[] = { "(invalid)", "(none)", "keypress", "keydown", "keyup", "click", "mousedown", "mouseup", "dblclick", "mousemove", "wheel", "resize",
  "scroll", "blur", "focus", "focusin", "focusout", "deviceorientation", "devicemotion", "orientationchange", "fullscreenchange", "pointerlockchange",
  "visibilitychange", "touchstart", "touchend", "touchmove", "touchcancel", "gamepadconnected", "gamepaddisconnected", "beforeunload",
  "batterychargingchange", "batterylevelchange", "webglcontextlost", "webglcontextrestored", "(invalid)" };
  ++eventType;
  if (eventType < 0) eventType = 0;
  if (eventType >= sizeof(events)/sizeof(events[0])) eventType = sizeof(events)/sizeof(events[0])-1;
  return events[eventType];
}

EM_BOOL handleKeypess(int eventType, const EmscriptenKeyboardEvent *keyEvent, void *keyDown){
  //printf("Got %s,%d - %ld!\n",emscripten_event_type_to_string(eventType),eventType,keyEvent->which);
  switch(eventType){
    case 2:
      ((bool*)keyDown)[keyEvent->which] = true;
      break;
    case 3:
      ((bool*)keyDown)[keyEvent->which] = false;
      break;
    default:
    printf("[Keyboard]: Event \"%s\" not recognised!\n",emscripten_event_type_to_string(eventType));
  }
  return true;
}

EM_BOOL handleMouse(int eventType, const EmscriptenMouseEvent* keyEvent, void* mouseInfo){
  switch(eventType){
    case EMSCRIPTEN_EVENT_MOUSEDOWN:
      ((mI*)mouseInfo)->mouseDown[keyEvent->button] = true;
      if(!((mI*)mouseInfo)->pointerLocked){
        emscripten_request_pointerlock(NULL, true);
        ((mI*)mouseInfo)->movementX = ((mI*)mouseInfo)->movementY = 0;
      }
      break;
    case EMSCRIPTEN_EVENT_MOUSEUP:
      ((mI*)mouseInfo)->mouseDown[keyEvent->button] = false;
      break;
    case EMSCRIPTEN_EVENT_MOUSEMOVE:
      ((mI*)mouseInfo)->movementX += keyEvent->movementX;
      ((mI*)mouseInfo)->movementY += keyEvent->movementY;
      ((mI*)mouseInfo)->mouseX = keyEvent->screenX;
      ((mI*)mouseInfo)->mouseY = keyEvent->screenY;
    break;
    default:
    printf("[Mouse]: Event \"%s\" not recognised!\n",emscripten_event_type_to_string(eventType));
  }
  return true;
}

REMKeyboard::REMKeyboard(){
}
REMKeyboard::~REMKeyboard(){
  EMSCRIPTEN_RESULT res1, res2;
  res1 = emscripten_set_keydown_callback(NULL, NULL, true, NULL);
  res2 = emscripten_set_keyup_callback(NULL, NULL, true, NULL);
}

void REMKeyboard::init(){
  em_key_callback_func callback = &handleKeypess;
  EMSCRIPTEN_RESULT res1, res2;
  res1 = emscripten_set_keydown_callback(NULL, keyDown, true, callback);
  res2 = emscripten_set_keyup_callback(NULL, keyDown, true, callback);
  if(res1>-1 && res2>-1){
    log("Listening for keystrokes");
  } else {
    log("Error listening for keystrokes: %d, %d",res1,res2);
  }
}

bool REMKeyboard::isKeyPressed(unsigned int key){
  return keyDown[key];
}

void REMKeyboard::log(char* chString,...){
  va_list args;
  va_start(args, chString);
  printf("[Keyboard]: ");
  vprintf(chString, args);
  printf("\n");
  va_end(args);
}

REMMouse::REMMouse(){
}

REMMouse::~REMMouse(){
  EMSCRIPTEN_RESULT res1, res2, res3;
  res1 = emscripten_set_mousedown_callback(NULL, NULL, true, NULL);
  res2 = emscripten_set_mouseup_callback(NULL, NULL, true, NULL);
  res2 = emscripten_set_mousemove_callback(NULL, NULL, true, NULL);
}

bool REMMouse::isKeyPressed(unsigned int key){
  return _mouseInfo.mouseDown[key];
}

POINT REMMouse::getMovement(){
  POINT mMovement;
  mMovement.x = _mouseInfo.movementX;
  mMovement.y = _mouseInfo.movementY;
  //log("Mouse movement is now at %d, %d",mMovement.x,mMovement.y);
  _mouseInfo.movementX = 0;
  _mouseInfo.movementY = 0;
  return mMovement;
}

EM_BOOL handleMousePointerLockChange(int eventType, const EmscriptenPointerlockChangeEvent *keyEvent, void* mouseInfo){
  ((mI*)mouseInfo)->pointerLocked = keyEvent->isActive;
  return true;
}

void REMMouse::init(){
  em_mouse_callback_func callback = &handleMouse;
  EMSCRIPTEN_RESULT res1, res2, res3;
  res1 = emscripten_set_mousedown_callback(NULL, &_mouseInfo, true, callback);
  res2 = emscripten_set_mouseup_callback(NULL, &_mouseInfo, true, callback);
  res3 = emscripten_set_mousemove_callback(NULL, &_mouseInfo, true, callback);
  if(res1>-1 && res2>-1 && res3>-1){
    log("Listening for mouse movement");
  } else {
    log("Error listening for mouse: %d, %d, %d",res1,res2,res3);
  }
  em_pointerlockchange_callback_func callback2 = &handleMousePointerLockChange;
  res1 = emscripten_set_pointerlockchange_callback(NULL, &_mouseInfo, true, callback2);
  if(res1>-1){
    log("Listening for pointer lock");
  } else {
    log("Error listening for pointer lock: %d",res1);
  }
}

mI REMMouse::getMouseInfo(){
  return _mouseInfo;
}

void REMMouse::log(char* chString,...){
  va_list args;
  va_start(args, chString);
  printf("[Mouse]: ");
  vprintf(chString, args);
  printf("\n");
  va_end(args);
}
