//Created by Maria Paula Saba and Maxwell Dayvson da Silva

//neopixels strip
#include <Adafruit_NeoPixel.h>

/* NEO_RGB     Pixels are wired for RGB bitstream
 NEO_GRB     Pixels are wired for GRB bitstream
 NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
 NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip)*/
#define TOTAL_STRIPS 2;
long time;
int alpha;
int periode = 2000;
int totalStrips = TOTAL_STRIPS;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(102, 5, NEO_GRB + NEO_KHZ800);

void setup() {
  initLeds();
}

void initLeds(){
  strip.begin();
  strip.show();
}
void loop() {
  fadeSlow(0, 0, 255);
}

void fadeSlow(int r, int g, int b){
  time = millis();
  fadePixels(time, r, g, b);
}

void fadeFast(int r, int g, int b){
  time = millis()*50;
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
