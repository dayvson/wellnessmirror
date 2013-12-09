//Created by Maria Paula Saba and Maxwell Dayvson da Silva

#include <Adafruit_NeoPixel.h>
#include <Bridge.h>
#include <HttpClient.h>
#include <math.h>

#define TIMECTL_MAXTICKS  4294967295L
#define TIMECTL_INIT      0
long time;
unsigned long flashTimeMark=0;
unsigned long flashTimeMark2=0;
long interval = 2000; 
long previousMillis = 0;
int alpha;
int periode = 2000;
char rChar[4] = "125";
char gChar[4] = "125";
char bChar[4] = "125";
char pattern[2] = "2";
char mode[2] = "1";
char *very_active = "5";
char *sendentary = "20";
char *fairly_active = "10";
char *lightly_active = "25";
char *sleep_time = "40";
int r = 0;
int g = 0;
int b = 255;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(102, 6, NEO_GRB + NEO_KHZ800);

void setup() {
//  Serial.begin(9600);  // initialize serial communication
//  while(!Serial);      // do nothing until the serial monitor is opened
//  Serial.println("Starting bridge...\n");

  Bridge.begin();  // make contact with the linux processor
  initLeds();
}

void initLeds(){
  strip.begin();
  strip.show();
}

int index = 0;
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
  int last = 0;
  last = atoi(sleep_time);
  strip.setBrightness(100);
  setPixelColorByRange(0, last, 0,0,255);
  setPixelColorByRange(last, last+atoi(sendentary), 0,255,255);
  last+=atoi(sendentary);
  setPixelColorByRange(last, last+atoi(lightly_active), 255,255,0);
  last+=atoi(lightly_active);
  setPixelColorByRange(last, last+atoi(fairly_active), 255,155,0);
  last+=atoi(fairly_active);
  setPixelColorByRange(last, last+atoi(very_active), 255,0,0);
}

void setPixelColorByRange(int start, int _end, int r, int g, int b){
  while(start<_end) {
    if(waitTime(&flashTimeMark, 10)){
      strip.setPixelColor(start,strip.Color(r, g, b));
      strip.show();
      start++;
    }   
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
 int pos = 0;
 while(pos<dur){
   if(waitTime(&flashTimeMark, 10)){
    alpha = easeInOutBounce(pos, 0, 100, 100);
    tintPixels(r, g, b, alpha);
    pos++;
   }
 }
 pos = 0;
 while(pos<dur){
   if(waitTime(&flashTimeMark, 10)){
    alpha = linearTween(pos, 100, -100, 100);
    tintPixels(r, g, b, alpha);
    pos++;
   }
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

void linearFadeAnimation(int r, int g, int b, int _start, int _end, int _dur){
  int alpha = 0;
  for (int pos=0; pos<_dur;){
    if(waitTime(&flashTimeMark, 10)){
      alpha = linearTween(pos, _start, _end, _dur);
      tintPixels(r, g, b, alpha);
      pos++;
    }
  }
}
void ideal(int r, int g, int b){
  tintPixels(r,g,b,100);
  if(waitTime(&flashTimeMark, 3000)){
    int dur = 20;  
    for(int i = 0; i<3; i++){
     linearFadeAnimation(r,b, g, 100, -100, dur);
     linearFadeAnimation(r,b, g, 0, 100, dur);
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

int waitTime(unsigned long *timeMark, unsigned long timeInterval){
  unsigned long timeCurrent;
  unsigned long timeElapsed;
  int result = false;
  timeCurrent = millis();
  if(timeCurrent<*timeMark){
    timeElapsed=(TIMECTL_MAXTICKS-*timeMark)+timeCurrent;
  }else{
    timeElapsed=timeCurrent-*timeMark;  
  }
  if(timeElapsed>=timeInterval) {
    *timeMark=timeCurrent;
    result=true;
  }
  return(result);  
}
