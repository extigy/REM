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
REMRenderDevice* rd;
REMULVertex* points;
float xx = 0;

void web_frame(){
  //draw calls
  xx=xx+0.03f;
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  REMVector* a = new REMVector(25.0f*sin(xx),0.0f,-25.0f);
  REMVector* b = new REMVector(0.0f,0.0f,0.0f);
  REMVector* c = new REMVector(0.0f,0.0f,0.0f);
  rd->setViewLookAt(*a,*b,*c);

  unsigned short indis[] = {0,1,2,0,3,1,4,5,6,4,7,5,7,1,5,7,1,3,4,2,6,0,2,4,4,3,0,4,7,3,2,5,6,2,1,5};
  rd->getVertexManager()->render(UL_VERTEX, 0, 8, 36, (void*)points, indis);
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
    //glViewport(0, 0, REMWIDTH/2, REMHEIGHT);
    glClearColor(1.0f,0.5f,0.0f,1.0f);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_BLEND);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    rd = new REMRenderDevice();
    rd->oneTimeInit();
    unsigned int nSkinID;
    REMColour cMat;
    cMat.fR = 1.0f;cMat.fG = 1.0f;cMat.fB = 1.0f;cMat.fA = 1.0f;
    REMColour cNone;
    cNone.fR = 0.0f;cNone.fG = 0.0f;cNone.fB = 0.0f;cNone.fA = 1.0f;
    REMColour cAmbient;
    cAmbient.fR = 0.2f;cAmbient.fG = 0.2f;cAmbient.fB = 0.2f;cAmbient.fA = 1.0f;

    rd->getSkinManager()->addSkin(&cAmbient,&cMat,&cNone,&cNone, 1.0f, &nSkinID);
    rd->getSkinManager()->addTexture(nSkinID, "awesome.png", true, 1.0f, NULL, 0);


    points = (REMULVertex*)malloc(8*sizeof(REMULVertex));
    memcpy(points[0].vcP, (float [4]){-5.0f, 5.0f, -5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[0].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[0].vcT, (unsigned short [2]){0, 0}, 2*sizeof(unsigned short));

    memcpy(points[1].vcP, (float [4]){5.0f, -5.0f, -5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[1].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[1].vcT, (unsigned short [2]){65535, 65535}, 2*sizeof(unsigned short));

    memcpy(points[2].vcP, (float [4]){-5.0f, -5.0f, -5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[2].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[2].vcT, (unsigned short [2]){0, 65535}, 2*sizeof(unsigned short));

    memcpy(points[3].vcP, (float [4]){5.0f,  5.0f, -5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[3].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[3].vcT, (unsigned short [2]){65535, 0}, 2*sizeof(unsigned short));

    memcpy(points[4].vcP, (float [4]){-5.0f, 5.0f, 5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[4].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[4].vcT, (unsigned short [2]){65535, 0}, 2*sizeof(unsigned short));

    memcpy(points[5].vcP, (float [4]){5.0f, -5.0f, 5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[5].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[5].vcT, (unsigned short [2]){0, 65535}, 2*sizeof(unsigned short));

    memcpy(points[6].vcP, (float [4]){-5.0f, -5.0f, 5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[6].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[6].vcT, (unsigned short [2]){65535, 65535}, 2*sizeof(unsigned short));

    memcpy(points[7].vcP, (float [4]){5.0f,  5.0f,  5.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[7].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[7].vcT, (unsigned short [2]){0, 0}, 2*sizeof(unsigned short));

    glfwSwapBuffers();

    //delete rd;
    emscripten_set_main_loop (web_frame, 0, true);
  }

  //glfwTerminate();
  return 0;
}
