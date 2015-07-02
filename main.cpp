#include <iostream>
#include <cmath>
#include <GL/glfw.h>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include "remrender.h"
#include "remsimplemodel.h"
#include "reminput.h"
#include "remmovement.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif
REMRenderDevice* rd;
REMSimpleModel* sm0;
REMSimpleModel* sm1;
REMInputManager* id;
REMFreeMC* freeCamera;
float xx = 0;

void web_frame(){
  //draw calls
  xx=xx+0.1f;
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  freeCamera->update(0.1f);
  POINT tempP;
  id->getPosition(IDV_MOUSE,&tempP);
  if(id->isPointerLocked())freeCamera->setRotationSpeed((float)(tempP.y)/20.0f, (float)(tempP.x)/20.0f, 0.0f);

  freeCamera->setThrustZ(0.0f);
  freeCamera->setThrustX(0.0f);
  freeCamera->setRotationSpeedZ(0.0f);
  if(id->isPressed(IDV_KEYBOARD, 87)){
    freeCamera->setThrustZ(0.5f);
  }
  if(id->isPressed(IDV_KEYBOARD, 83)){
    freeCamera->setThrustZ(-0.5f);
  }
  if(id->isPressed(IDV_KEYBOARD, 68)){
    freeCamera->setThrustX(0.5f);
  }
  if(id->isPressed(IDV_KEYBOARD, 65)){
    freeCamera->setThrustX(-0.5f);
  }
  if(id->isPressed(IDV_KEYBOARD, 81)){
    freeCamera->setRotationSpeedZ(-0.5f);
  }
  if(id->isPressed(IDV_KEYBOARD, 69)){
    freeCamera->setRotationSpeedZ(0.5f);
  }

  freeCamera->setAsView(rd);
  REMMatrix* world = new REMMatrix();
  int i=0,k=0;
  for(i=-20;i<20;i++){
    //for(k=-20;k<20;k++){
      world->identity();
      world->scale(1.0f,1.0f,1.0f);
      world->translate(0.0f,0.0f,i);
      rd->setWorldTransform(world);
      if((int)(i+xx)%3 == 0){
        rd->getVertexManager()->render(CEL_VERTEX, sm0->_nSkin, sm0->_nNumVertices, sm0->_nNumIndices, sm0->_pVertices, sm0->_pIndices);
      } else {
        rd->getVertexManager()->render(CEL_VERTEX, sm1->_nSkin, sm1->_nNumVertices, sm1->_nNumIndices, sm1->_pVertices, sm1->_pIndices);
      }
    //}
  }
  for(i=-20;i<20;i++){
    if(i==0)continue;
    world->identity();
    world->scale(1.0f,1.0f,1.0f);
    world->translate(i,0.0f,0.0f);
    rd->setWorldTransform(world);
    if((int)(i+xx)%3 == 0){
      rd->getVertexManager()->render(CEL_VERTEX, sm0->_nSkin, sm0->_nNumVertices, sm0->_nNumIndices, sm0->_pVertices, sm0->_pIndices);
    } else {
      rd->getVertexManager()->render(CEL_VERTEX, sm1->_nSkin, sm1->_nNumVertices, sm1->_nNumIndices, sm1->_pVertices, sm1->_pIndices);
    }
  }
  rd->getVertexManager()->forcedFlushAll();
  delete world;

  /*
  if(id->isPressed(IDV_MOUSE, 0)){
    printf("Mouse0 is pressed!\n");
  }
  if(id->isPressed(IDV_MOUSE, 2)){
    printf("Mouse2 is pressed!\n");
  }
  id->getPosition(IDV_MOUSE,&temp);
  */
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
    id->init();
    rd = new REMRenderDevice();
    rd->oneTimeInit();
    freeCamera = new REMFreeMC();
    glfwSwapBuffers();

    sm0 = new REMSimpleModel(rd,CEL_VERTEX);
    sm0->readFile("models/box0.obj");
    sm1 = new REMSimpleModel(rd,CEL_VERTEX);
    sm1->readFile("models/box1.obj");


    REMVector dMat;
    REMColour cMat;
    dMat.x = 0.577f;
    dMat.y = -0.577f;
    dMat.z = 0.577f;
    dMat.w = 0.0f;
    cMat.fR = 0.9f;
    cMat.fG = 0.9f;
    cMat.fB = 0.9f;
    cMat.fA = 1.0f;
    rd->getLightManager()->setDirLight(cMat, dMat);
    rd->getLightManager()->setAmbientLight(cMat);
    cMat.fR = 0.0f;
    cMat.fG = 0.0f;
    cMat.fB = 0.8f;
    cMat.fA = 1.0f;
    //rd->getLightManager()->addPointLight(cMat, 1.0f, 1.0f, 0.0f,1.5f);
    //rd->getLightManager()->enableLightBank(0);

    rd->getShaderManager()->activateProgram(3);
    //delete rd;
    emscripten_set_main_loop (web_frame, 0, true);
  }

  //glfwTerminate();
  return 0;
}
