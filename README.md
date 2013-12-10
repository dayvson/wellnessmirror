Wellness Mirror
===============

Wellness Mirror is a mirror that reads a person’s quantified self data (physical activities, sleep hours, weight…) from Fitbit and translates 
the data into different colors and patterns of light that illuminates users in front of the mirror. 
In this way, users can see a person’s vigor and vitality through the reflection of themselves altered by the data.

###Research:
Quantified self devices are becoming each time more popular. People are interested in how much they sleep, walk, exercise, drink and so on. This data represents our lives and habits. Our energy and rest. However, it is presented to us in a very unsympathetic way: numbers and charts. In an attempt of humanizing QS data, I decide to explore different ways of visualizing everyday data. My goal was to bring the data to the user’s routine in a seamless, abstract or maybe even poetic way.

###Implementation
The Wellness mirror prototype was built on top of a regular mirror using 102 neopixels (RGB Leds from Adafruit) in a strip inside a boxed frame made of frosted plexi. The plexi was laser cut and glued with acrylic glue. The frame attaches to the original mirror with screws. There is also a PIR motion sensor that recognizes if there is someone around or not. In this way, the mirror does not need to be illuminated at all times. From the mirror, a cable goes to a dark box, which contains a protoboard and an Arduino Yun, and a power supply.

The Arduino Yun gets the values through its REST API from a website, developed in Node.js, with Express and Temboo API. The website is the interface to control which range of time and visualization mode is displayed in the mirror. The workflow is: the users authenticates his Fitbit account, the site makes requests through Temboo, the data retrieved is analyzed and the desired mode, color and pattern is sent to Arduino.

You can find an extended documentation/evolution version of this project at <a href="http://itp.nyu.edu/~msd403/blog/?p=1301">Maria Paula ITP blog</a> 

##Prototype Images

<img src="http://itp.nyu.edu/~msd403/blog/wp-content/uploads/2013/11/diagram.jpg" width="100%"/>
<img src="http://itp.nyu.edu/~msd403/blog/wp-content/uploads/2013/12/legenda-01-1024x566.jpg" width="100%" />
<img src="http://itp.nyu.edu/~msd403/blog/wp-content/uploads/2013/11/photo-1-copy-e1384819474274.jpg" width="100%"/>
<img src="http://itp.nyu.edu/~msd403/blog/wp-content/uploads/2013/11/photo-2-copy.jpg" width="100%"/>
<img src="http://f.cl.ly/items/0a3H3l0j2l1O1N3V1s2L/mirror_power_box.jpg" width="100%" />
<img src="http://f.cl.ly/items/3X1v1z1x3y2f130a2a3I/photo%202.JPG"  width="100%"/>
<img src="http://f.cl.ly/items/3k0j2V1q431u1k0a380f/photo%204.JPG"  width="100%" />
<img src="http://itp.nyu.edu/~msd403/blog/wp-content/uploads/2013/12/IMG_9561--1024x682.jpg" width="100%" />
<img src="http://itp.nyu.edu/~msd403/blog/wp-content/uploads/2013/12/both-1024x519.jpg" width="100%" />

##AUTHORS

####<a href="http://www.mariapaulasaba.com.br/">Maria Paula Saba</a>
####<a href="http://www.github.com/dayvson">Maxwell Dayvson da Silva</a>

