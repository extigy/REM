#include <iostream>
#include <cmath>
#include <GL/glfw.h>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include "remrender.h"
#include "remsimplemodel.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif
REMRenderDevice* rd;
REMSimpleModel* sm;
float xx = 0;

void web_frame(){
  //draw calls
  xx=xx+0.03f;
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  REMVector* a = new REMVector(5.0f,5.0f,5.0f);
  REMVector* b = new REMVector(0.0f,0.0f,0.0f);
  REMVector* c = new REMVector(0.0f,1.0f,0.0f);
  rd->setViewLookAt(*a,*b,*c);
  REMMatrix* world = new REMMatrix();
  world->identity();
  world->translate(4.0f,0.0f,0.0f);
  rd->setWorldTransform(world);

  rd->getVertexManager()->render(UU_VERTEX, 0, sm->_nNumVertices, sm->_nNumIndices, sm->_pVertices, sm->_pIndices);
  rd->getVertexManager()->forcedFlushAll();

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
    rd = new REMRenderDevice();
    rd->oneTimeInit();
    unsigned int nSkinID;
    REMColour cOne;
    cOne.fR = 1.0f;cOne.fG = 1.0f;cOne.fB = 1.0f;cOne.fA = 1.0f;
    REMColour cNone;
    cNone.fR = 0.0f;cNone.fG = 0.0f;cNone.fB = 0.0f;cNone.fA = 1.0f;

    rd->getSkinManager()->addSkin(&cOne,&cOne,&cNone,&cNone, 1.0f, &nSkinID);
    rd->getSkinManager()->addTexture(nSkinID, "textures/brick.jpg", true, 1.0f, NULL, 0);
    //rd->getSkinManager()->addTexture(nSkinID, "textures/brick-detail.jpg", true, 1.0f, NULL, 0);
    glfwSwapBuffers();

    sm = new REMSimpleModel(rd,UU_VERTEX);
    sm->readFile("models/box.obj");
    //delete rd;
    emscripten_set_main_loop (web_frame, 0, true);
  }

  //glfwTerminate();
  return 0;
}
