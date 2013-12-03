//Created by Maria Paula Saba and Maxwell Dayvson da Silva

//neopixels strip
#include <Adafruit_NeoPixel.h>
#include <Bridge.h>
#include <HttpClient.h>
#include <math.h>

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
char rChar[4] = "125";
char gChar[4] = "125";
char bChar[4] = "125";
char pattern[2] = "2";
char mode[2] = "1";
char very_active[5] = "5";
char sendentary[5] = "20";
char fairly_active[5] = "10";
char lightly_active[5] = "25";
char sleep_time[5] = "40";
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
  Bridge.get("r", rChar, 256);
  Bridge.get("g", gChar, 256);
  Bridge.get("b", bChar, 256);
  Bridge.get("pattern", pattern, 2);
  Bridge.get("mode", mode, 2);
  Bridge.get("sleep_time", sleep_time, 5);
  Bridge.get("very_active", very_active, 5);
  Bridge.get("sendentary", sendentary, 5);
  Bridge.get("fairly_active", fairly_active, 5);
  Bridge.get("lightly_active", lightly_active, 5);
  r = atoi(rChar);
  g = atoi(gChar);
  b = atoi(bChar);
  if(atoi(mode) == 1) activities();
  else setColorAndPattern(r, g, b, atoi(pattern));

}

void setColorAndPattern(int r, int g, int b, int pattern){
  switch (pattern) {
    case 1:    
      off(r, g, b);
      break;
    case 2:
      sedentary(r, g, b);
      break;
    case 3:
      lazy(r, g, b);
      break;
    case 4:
      ideal(r, g, b);
      break;
    case 5:
      vigorous(r, g, b);
      break;
    case 6:
      hyperative(r, g, b);
      break;
    default:
      notrecorded(r, g, b);
  }  
}


void activities() {

  int last = atoi(very_active);
  setPixelColorByRange(0, last, 255,0,255);
  setPixelColorByRange(last, last+atoi(sendentary), 255,0,0);
  last+=atoi(sendentary);
  setPixelColorByRange(last, last+atoi(fairly_active), 255,255,0);
  last+=atoi(fairly_active);
  setPixelColorByRange(last, last+atoi(lightly_active), 0,255,255);
  last+=atoi(lightly_active);
  setPixelColorByRange(last, last+atoi(sleep_time), 255,155,0);
  strip.setBrightness(100);
  strip.show();
}

void setPixelColorByRange(int start, int _end, int r, int g, int b){
  for(uint16_t i=start; i<_end; i++) {
    strip.setPixelColor(i,strip.Color(r, g, b));  
  }
}

void off(int r, int g, int b){
  tintPixels(r, g, b, 0);  
}

void sedentary(int r, int g, int b){
  time = millis()/2;
  fadePixels(time, r, g, b);
}

void lazy(int r, int g, int b){
 int dur = 100;
 for (int pos=0; pos<dur; pos++){
    alpha = easeInOutBounce(pos, 0, 100, 100);
    tintPixels(r, g, b, alpha);
    delay(50); 
 }
 delay(300);
 for (int pos=0; pos<dur; pos++){
    alpha = linearTween(pos, 100, -100, 100);
    tintPixels(r, g, b, alpha);
    delay(10);
 }
}

void notrecorded(int r, int g, int b){
    tintPixels(r, g, b, 100);
}

void hyperative(int r, int g, int b){
  time = millis()*10;
  fadePixels(time, r, g, b);
}

void vigorous(int r, int g, int b){
  time = millis()*5;
  fadePixels(time, r, g, b);
}

void ideal(int r, int g, int b){
  tintPixels(r,g,b,100);
  delay(3000);
  int dur = 20;
  for(int i = 0; i<3; i++){
   for (int pos=0; pos<dur; pos++){
      alpha = linearTween(pos, 100, -100, dur);
      tintPixels(r, g, b, alpha);
      delay(10);
   }
   for (int pos=0; pos<dur; pos++){
      alpha = linearTween(pos, 0, 100, dur);
      tintPixels(r, g, b, alpha);
      delay(10); 
   }
  }
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


// t: current time, b: beginning value, c: change in value, d: duration
float linearTween (float t, float b, float c, float d) {
  return c*t/d + b;
}

float easeInOutSine (float t, float b, float c, float d) {
  return -c/2 * (cos(M_PI*t/d) - 1) + b;
}

float easeInBounce (float t, float b, float c, float d) {
  return c - easeOutBounce (d-t, 0, c, d) + b;
}

float easeOutBounce (float t, float b, float c, float d) {
  if ((t/=d) < (1/2.75)) {
    return c*(7.5625*t*t) + b;
  } else if (t < (2/2.75)) {
    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  } else if (t < (2.5/2.75)) {
    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  } else {
    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  }
}

float easeInOutBounce (float t, float b, float c, float d) {
  if (t < d/2){
    return easeInBounce (t*2, 0, c, d) * .5 + b;
  }
  return easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
}
