#include <Bridge.h>
#include <HttpClient.h>
#include <Adafruit_NeoPixel.h>
#define PIN 6

Adafruit_NeoPixel strip = Adafruit_NeoPixel(3, PIN, NEO_GRB + NEO_KHZ800);


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);  // initialize serial communication
  while(!Serial);      // do nothing until the serial monitor is opened
  Serial.println("Starting sketch...\n");

  Bridge.begin();  // make contact with the linux processor
  
  strip.begin();
  strip.show();  
}

void loop() {
  HttpClient client;
  // put your main code here, to run repeatedly: 
  Serial.println();
  String data ="";
  client.get("http://localhost:3000/color");
  while (client.available()) {
    char p = client.read();
    data += p;
  }
  Serial.println(data);
  int index1 = data.indexOf(',');
  int index2 = data.indexOf(';');
  String r = data.substring(0, index1);
  String g = data.substring(index1+1, index2);
  String b = data.substring(index2+1);
  Serial.println("R:" + r);
  Serial.println("G:" + g);
  Serial.println("B:" + b);


  colorWipe(strip.Color(r.toInt(), g.toInt(), b.toInt()), 50); 

    
  delay(500);
}


    
  // Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
  }
  delay(wait);

}
