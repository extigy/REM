#include <iostream>
#include <cmath>
#include <GL/glfw.h>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include "remrender.h"
#include "remsimplemodel.h"
#include "reminput.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif
REMRenderDevice* rd;
REMSimpleModel* sm;
REMInputManager* id;
float xx = 0;

void web_frame(){
  //draw calls
  xx=xx+0.01f;
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  REMVector* a = new REMVector(4.0f*sin(xx),sin(xx)*4.0f+4.5f,4.0f*cos(xx));
  REMVector* b = new REMVector(0.0f,0.0f,0.0f);
  REMVector* c = new REMVector(0.0f,1.0f,0.0f);
  rd->setViewLookAt(*a,*b,*c);
  REMMatrix* world = new REMMatrix();
  int i=0,k=0;
  rd->getShaderManager()->activateProgram(3);
  //for(i=-5;i<6;i++){
    //for(k=-5;k<6;k++){
      world->identity();
      //world->scale(1.0f,1.0f+sqrt(i*i*k*k)/4.0f,1.0f);
      //world->translate(1.5f*i,0.0f,1.5f*k);
      rd->setWorldTransform(world);
      rd->getVertexManager()->render(CEL_VERTEX, sm->_nSkin, sm->_nNumVertices, sm->_nNumIndices, sm->_pVertices, sm->_pIndices);
    //}
  //}
  rd->getVertexManager()->forcedFlushAll();
  delete world;

  if(id->isPressed(IDV_KEYBOARD, 68)){
    printf("D is pressed!\n");
  }
  if(id->isPressed(IDV_MOUSE, 0)){
    printf("Mouse0 is pressed!\n");
  }
  if(id->isPressed(IDV_MOUSE, 2)){
    printf("Mouse2 is pressed!\n");
  }
  glfwSwapBuffers();
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
    glClearColor(1.0f,0.5f,0.0f,1.0f);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_BLEND);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    id = new REMInputManager();
    rd = new REMRenderDevice();
    rd->oneTimeInit();
    glfwSwapBuffers();

    sm = new REMSimpleModel(rd,CEL_VERTEX);
    sm->readFile("models/box0.obj");

    REMVector dMat;
    REMColour cMat;
    dMat.x = 0.577f;
    dMat.y = -0.577f;
    dMat.z = 0.577f;
    dMat.w = 0.0f;
    cMat.fR = 0.8f;
    cMat.fG = 0.8f;
    cMat.fB = 0.8f;
    cMat.fA = 1.0f;
    rd->getLightManager()->setDirLight(cMat, dMat);

    cMat.fR = 0.0f;
    cMat.fG = 0.0f;
    cMat.fB = 0.8f;
    cMat.fA = 1.0f;
    //rd->getLightManager()->addPointLight(cMat, 1.0f, 1.0f, 0.0f,1.5f);
    //rd->getLightManager()->enableLightBank(0);

    //delete rd;
    emscripten_set_main_loop (web_frame, 0, true);
  }

  //glfwTerminate();
  return 0;
}
