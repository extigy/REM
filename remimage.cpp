#include "remimage.h"
#include "const.h"
#include <GLES2/gl2.h>

REMRawImage* rawImageFromBMP(const char *chName){
  REMRawImage* rI = new REMRawImage;

  rI->bmp = SDL_LoadBMP(chName);
  if (rI->bmp == NULL) {
    printf("[IMAGE]: Couldn't load %s", chName);
    return NULL;
  }
  rI->width = rI->bmp->w;
  rI->height = rI->bmp->h;
  switch(rI->bmp->format->BitsPerPixel){
    case 32:
      rI->format=GL_RGBA;
      rI->type=GL_UNSIGNED_BYTE;
      break;
  }
  rI->pData = (unsigned int*)(rI->bmp->pixels);
  printf("[IMAGE]: Loaded %s. %dx%d with %d bbp.\n", chName, rI->width, rI->height, rI->bmp->format->BitsPerPixel);
  return rI;
}

int setAlphaKeyRaw(REMRawImage* rI,unsigned char R,unsigned char G,unsigned char B,unsigned char A){
  unsigned int colour = 0;
  SDL_PixelFormat *fmt;
  fmt = rI->bmp->format;
  colour = SDL_MapRGB(fmt,R,G,B);
  return SDL_SetColorKey(rI->bmp, SDL_TRUE, colour);
}

int setAlphaRaw(REMRawImage* rI,unsigned char A){
  //return SDL_SetSurfaceAlphaMod(rI->bmp,A);
  //TODO: Fix this
  return 0;
}

void releaseRawImage(const REMRawImage* data){
  SDL_FreeSurface(data->bmp);
  delete data;
}
