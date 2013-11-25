//Created by Maria Paula Saba and Maxwell Dayvson da Silva

//neopixels strip
#include <Adafruit_NeoPixel.h>
#include <Bridge.h>
#include <HttpClient.h>

/* NEO_RGB     Pixels are wired for RGB bitstream
 NEO_GRB     Pixels are wired for GRB bitstream
 NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
 NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip)*/
#define TOTAL_STRIPS 2;
long time;
long interval = 2000; 
long previousMillis = 0;
int alpha;
int periode = 2000;
int totalStrips = TOTAL_STRIPS;
char rChar[256];
char gChar[256];
char bChar[256];
int r = 0;
int g = 0;
int b = 255;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(102, 6, NEO_GRB + NEO_KHZ800);

void setup() {
  Bridge.begin();  // make contact with the linux processor

  initLeds();
}

void initLeds(){
  
  strip.begin();
  strip.show();
}
void loop() {
  fadeSlow(r, g, b);
  Bridge.get("r", rChar, 256);
  Bridge.get("g", gChar, 256);
  Bridge.get("b", bChar, 256);
  r = atoi(rChar);
  g = atoi(gChar);
  b = atoi(bChar);
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
