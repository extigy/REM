#include <iostream>
#include <cmath>
#include <GL/glfw.h>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include "remrender.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

void web_frame(){
  //draw calls
}

int initGL(){
  if (glfwInit() != GL_TRUE) {
    printf("glfwInit() failed\n");
    return GL_FALSE;
  }
  if (glfwOpenWindow(REMWIDTH, REMHEIGHT, 8, 8, 8, 8, 32, 0, GLFW_WINDOW) != GL_TRUE) {
    printf("glfwOpenWindow() failed\n");
    return GL_FALSE;
  }
  return GL_TRUE;
}

int main(int argc, char **argv){
  if (initGL() == GL_TRUE) {
    //glViewport(0, 0, REMWIDTH/2, REMHEIGHT);
    glClearColor(1.0f,0.5f,0.0f,1.0f);
    glEnable(GL_DEPTH_TEST);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    REMRenderDevice* rd = new REMRenderDevice();
    rd->setMode(PERSPECTIVE,0);
    rd->initStage(0.8f, NULL, 0);
    rd->setClippingPlanes(0.1f, 1000.0f);
    rd->setWorldTransform(NULL);
    glfwSwapBuffers();

    delete rd;
  }
  //glfwTerminate();
  return 0;
}
