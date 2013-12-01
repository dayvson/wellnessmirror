#include <Adafruit_NeoPixel.h>

long time;
int alpha;
int periode = 1000;
int s;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(102, 6, NEO_GRB + NEO_KHZ800);

struct RGB {
  byte r;
  byte g;
  byte b;
};



void setup() {
  // put your setup code here, to run once:
  strip.begin();
  strip.show();
  

}

void loop() {

//choose color
//  RGB color = { 255 , 255, 255}; //white
//  RGB color = { 255 , 0 , 255};  //pink
  RGB color = { 255 , 0 , 0 };   //red
//  RGB color = { 255 , 155 , 0 }; //orange
//  RGB color = { 255 , 255 , 0 }; //yellow
//  RGB color = { 0 , 255 , 255 }; //turquoise
//  RGB color = { 0 , 0 , 255 };   //blue  

//choose speed
//  s = 1; 
    s = 2; 
//  s = 3;
//  s = 5;
//  s = 10;

  //fading slow
  //fadeSlow(color.r, color.g, color.b, s);
   
  //fading fast 
  //fadeFast(color.r, color.g, color.b, s);
 
  //no fading
 // tintPixels(color.r, color.g, color.b, 255);

  tintPixels2ColorsLeftRight(color.r, color.g, color.b, 0, 255, 255, 255);
}



void fadeSlow(int r, int g, int b, int freq){
  time = millis()/freq;
  fadePixels(time, r, g, b);
}

void fadeFast(int r, int g, int b, int freq){
  time = millis()*freq;
  fadePixels(time, r, g, b);
}


void fadePixels(int time, int r, int g, int b){
  alpha = 128+127*cos(2*PI/periode*time);
  tintPixels(r, g, b, alpha);
}

void tintPixels(int r, int g, int b, int a){
  strip.setBrightness(a);
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      uint32_t c = strip.Color(r, g, b);
      strip.setPixelColor(i,c);
  }
  strip.show();
}

void tintPixels2ColorsLeftRight(int r1, int g1, int b1, int r2, int g2, int b2, int a){
  strip.setBrightness(a);
  for(uint16_t i=0; i<strip.numPixels()/2-12; i++) {
      uint32_t c = strip.Color(r1, g1, b1);
      strip.setPixelColor(i,c);
  }
  
    for(uint16_t i=strip.numPixels()/2-12; i<strip.numPixels()-12; i++) {
      uint32_t c = strip.Color(r2, g2, b2);
      strip.setPixelColor(i,c);
  }
  
    for(uint16_t i=strip.numPixels()-12; i<strip.numPixels(); i++) {
      uint32_t c = strip.Color(r1, g1, b1);
      strip.setPixelColor(i,c);
  }
  strip.show();
}

void tintPixels2ColorsUpDown(int r1, int g1, int b1, int r2, int g2, int b2, int a){
  strip.setBrightness(a);
  for(uint16_t i=0; i<14; i++) {
      uint32_t c = strip.Color(r2, g2, b2);
      strip.setPixelColor(i,c);
  }
  
    for(uint16_t i=14; i<strip.numPixels()/2+12; i++) {
      uint32_t c = strip.Color(r1, g1, b1);
      strip.setPixelColor(i,c);
  }
  
    for(uint16_t i=strip.numPixels()/2+12; i<strip.numPixels(); i++) {
      uint32_t c = strip.Color(r2, g2, b2);
      strip.setPixelColor(i,c);
  }
  strip.show();
}
