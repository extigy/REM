#include "reminput.h"
#include "const.h"


REMInputManager::REMInputManager(){
  keyboard = new REMKeyboard();
  keyboard->init();
  mouse = new REMMouse();
  mouse->init();
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

EM_BOOL handleMouse(int eventType, const EmscriptenMouseEvent *keyEvent, void *mouseDown){
  //printf("Got %s,%d - %ld!\n",emscripten_event_type_to_string(eventType),eventType,keyEvent->button);
  switch(eventType){
    case EMSCRIPTEN_EVENT_MOUSEDOWN:
    ((bool*)mouseDown)[keyEvent->button] = true;
    break;
    case EMSCRIPTEN_EVENT_MOUSEUP:
    ((bool*)mouseDown)[keyEvent->button] = false;
    break;
    case EMSCRIPTEN_EVENT_MOUSEMOVE:
    //break;
    default:
    printf("[Mouse]: Event \"%s\" not recognised!\n",emscripten_event_type_to_string(eventType));
  }
  return true;
}

REMKeyboard::REMKeyboard(){
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

bool REMMouse::isKeyPressed(unsigned int key){
  return mouseDown[key];
}

void REMMouse::init(){
  em_mouse_callback_func callback = &handleMouse;
  EMSCRIPTEN_RESULT res1, res2;
  res1 = emscripten_set_mousedown_callback(NULL, mouseDown, true, callback);
  res2 = emscripten_set_mouseup_callback(NULL, mouseDown, true, callback);
  if(res1>-1 && res2>-1){
    log("Listening for mouse movement");
  } else {
    log("Error listening for keystrokes: %d, %d",res1,res2);
  }
}

void REMMouse::log(char* chString,...){
  va_list args;
  va_start(args, chString);
  printf("[Mouse]: ");
  vprintf(chString, args);
  printf("\n");
  va_end(args);
}
