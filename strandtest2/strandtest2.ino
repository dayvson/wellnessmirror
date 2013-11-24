//Created by Maria Paula Saba and Maxwell Dayvson da Silva

//neopixels strip
#include <Adafruit_NeoPixel.h>
#ifdef _AVR_ATtiny85_ // Trinket, Gemma, etc.
#include <avr/power.h>
#endif

#define PIN 6
#define totalLEDs 20 
/* NEO_RGB     Pixels are wired for RGB bitstream
   NEO_GRB     Pixels are wired for GRB bitstream
   NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
   NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip)*/
Adafruit_NeoPixel strip = Adafruit_NeoPixel(totalLEDs, PIN, NEO_GRB + NEO_KHZ800);


long time;
int value;
int periode = 2000;

void setup() {
  // Initialize all pixels 
  Serial.begin(9600);
  
  strip.begin();
 }

void loop() {
  // Change color 
  //colorWipe(strip.Color(255, 0, 0)); // Off
  fadeSlow();
  //fadeFast();
}

// Fill the dots one after the other with a color
void colorWipe(uint32_t c) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
  }
}

void fadeSlow(){
  time = millis()/2;
  
  for(uint16_t i=0; i<strip.numPixels(); i++) {
  value = 128+127*cos(2*PI/periode*time);
    uint32_t c = strip.Color(0, value, 0);
    strip.setPixelColor(i,c);
    strip.show();
  }  
}


void fadeFast(){
  time = millis()*50;
  for(uint16_t i=0; i<strip.numPixels(); i++) {
  value = 128+127*cos(2*PI/periode*time);
    uint32_t c = strip.Color(0, 0, value);
    
    strip.setPixelColor(i,c);
    strip.show();
  }  
}



