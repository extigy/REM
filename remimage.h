#ifndef REMIMAGE_H
#define REMIMAGE_H
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include <SDL.h>

typedef unsigned int GLenum;

typedef struct REMRAWIMAGE_TYPE{
  int width;
  int height;
  GLenum format;
  GLenum type;
  void* pData;
  SDL_Surface *bmp;
} REMRawImage;


REMRawImage* rawImageFromBMP(const char *chName);
void releaseRawImage(const REMRawImage* data);
int setAlphaKeyRaw(REMRawImage* rI,unsigned char R,unsigned char G,unsigned char B,unsigned char A);
int setAlphaRaw(REMRawImage* rI,unsigned char A);
#endif
