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
  initLeds();
}

void initLeds(){
  strip.begin();
  strip.show();
}

int index = 0;
void loop() {
  r = 255;
  g = 0;
  b = 0;
  if(waitTime(&flashTimeMark2, 6000)){
      index+=1;
      if(index > 7 ) index = 1;
  }
  
  if(index == 1){ 
   setColorAndPattern(255,0,255, 2);   
  }else if(index == 2){
    setColorAndPattern(255,155,0, 3);
  }else if(index == 3){
    setColorAndPattern(0,255,255, 4);
  }else if(index == 4){
    setColorAndPattern(0,0,255, 5);
  }else if(index == 5){
    setColorAndPattern(255,255,0, 6); 
  }else if (index == 6) {
    very_active = "5";
    sendentary = "20";
    fairly_active = "10";
    lightly_active = "25";
    sleep_time = "40";
    activities(); 
  }else if( index == 7 ){
    very_active = "20";
    sendentary = "10";
    fairly_active = "40";
    lightly_active = "1";
    sleep_time = "29";
    activities();
  }
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
  int last = atoi(sleep_time) + 2;
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

void linearFadeAnimation(int r, int g, int b, int _start, int _end, int _dur){
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
  if(t < d/2){
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
