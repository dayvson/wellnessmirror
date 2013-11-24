//Created by Maria Paula Saba and Maxwell Dayvson da Silva
#include <Adafruit_NeoPixel.h>

#define PIN 6


int ledPin = 13;                // choose the pin for the LED
int inputPin = 2;               // choose the input pin (for PIR sensor)
int pirState = LOW;             // we start, assuming no motion detected
int val = 0;                    // variable for reading the pin status


Adafruit_NeoPixel strip = Adafruit_NeoPixel(120, PIN, NEO_GRB + NEO_KHZ800);


void setup() {
  pinMode(ledPin, OUTPUT);      // declare LED as output
  pinMode(inputPin, INPUT);     // declare sensor as input

  Serial.begin(9600);
  
    strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

void loop(){


  if(millis()%5000 == 0){
    val = digitalRead(inputPin);  // read input value
    if (val == HIGH) {            // check if the input is HIGH
      digitalWrite(ledPin, HIGH);  // turn LED ON
        colorWipe(strip.Color(0, 255, 0), 1000); // Red
        colorWipe(strip.Color(255, 0, 255), 1000); // Red
        colorWipe(strip.Color(0, 0, 255), 1000); // Red

      if (pirState == LOW) {
        // we have just turned on
        Serial.println("Motion detected!");
        // We only want to print on the output change, not state
        pirState = HIGH;
      }
      else{
        Serial.println("Still detecting!");   
      }
    } 
    else {
      digitalWrite(ledPin, LOW); // turn LED OFF
        colorWipe(strip.Color(255, 0, 0), 0); // Yellow

      if (pirState == HIGH){
        // we have just turned of
        Serial.println("Motion ended!");
        // We only want to print on the output change, not state
        pirState = LOW;
      }
      else{
        Serial.println("Nothing here!");

      }
    }
  }
}

void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
  }
       delay(wait);
 
}
