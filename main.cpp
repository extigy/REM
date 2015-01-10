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
  xx=xx+0.1f;
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  REMVector* pos = new REMVector(0.0f,0.0f,-5.0f+cos(xx)*5.0f);
  REMVector* poi = new REMVector(0.0f,0.0f,1.0f);
  REMVector* wup = new REMVector(0.0f,1.0f,0.0f);
  rd->setViewLookAt(*pos,*poi,*wup);
  unsigned short indis[] = {0,1,2,0,3,1};
  rd->getVertexManager()->render(UL_VERTEX, 0, 4, 6, (void*)points, indis);
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
    cMat.fR = 1.0f;
    cMat.fG = 1.0f;
    cMat.fB = 1.0f;
    cMat.fA = 1.0f;
    rd->getSkinManager()->addSkin(&cMat,&cMat,&cMat,&cMat, 1.0f, &nSkinID);
    points = (REMULVertex*)malloc(4*sizeof(REMULVertex));
    memcpy(points[0].vcP, (float [4]){-5.0f, 5.0f, 15.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[0].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[0].vcT, (unsigned short [2]){0, 0}, 2*sizeof(unsigned short));

    memcpy(points[1].vcP, (float [4]){5.0f, -5.0f, 15.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[1].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[1].vcT, (unsigned short [2]){0, 0}, 2*sizeof(unsigned short));

    memcpy(points[2].vcP, (float [4]){-5.0f, -5.0f,  15.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[2].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[2].vcT, (unsigned short [2]){0, 0}, 2*sizeof(unsigned short));

    memcpy(points[3].vcP, (float [4]){5.0f,  5.0f,  15.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[3].vcC, (float [4]){1.0f, 1.0f, 1.0f, 1.0f}, 4*sizeof(float));
    memcpy(points[3].vcT, (unsigned short [2]){0, 0}, 2*sizeof(unsigned short));

    unsigned short indis[] = {0,1,2,0,3,1};
    glfwSwapBuffers();

    //delete rd;
    emscripten_set_main_loop (web_frame, 0, true);

    REMMatrix a,b;
    a.identity();
    b.identity();
    int x,y;
    a._data[1][0] = b._data[0][1]= 1.0f;
    for(x = 0 ; x < 4 ; x++) {
      printf(" (");
      for(y = 0 ; y < 4 ; y++){
        printf("%f     ", a._data[x][y]);
      }
      printf(")\n");
    }
    printf("\n");
    for(x = 0 ; x < 4 ; x++) {
      printf(" (");
      for(y = 0 ; y < 4 ; y++){
        printf("%f     ", b._data[x][y]);
      }
      printf(")\n");
    }
    printf("\n");
    for(x = 0 ; x < 4 ; x++) {
      printf(" (");
      for(y = 0 ; y < 4 ; y++){
        printf("%f     ", (a*b)._data[x][y]);
      }
      printf(")\n");
    }


  }

  //glfwTerminate();
  return 0;
}
