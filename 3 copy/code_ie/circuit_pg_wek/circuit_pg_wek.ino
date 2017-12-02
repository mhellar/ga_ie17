#include <Adafruit_CircuitPlayground.h>

float X, Y, Z;
bool leftButtonPressed;
bool rightButtonPressed;

void setup() {
  Serial.begin(9600);
  CircuitPlayground.begin();
}

void loop() {
  X = CircuitPlayground.motionX();
  Y = CircuitPlayground.motionY();
  Z = CircuitPlayground.motionZ();

  leftButtonPressed = CircuitPlayground.leftButton();
  rightButtonPressed = CircuitPlayground.rightButton();


  if (leftButtonPressed) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }
  Serial.print(",");
  if (rightButtonPressed) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }
  Serial.print(",");
  Serial.print(X);
  Serial.print(",");
  Serial.print(Y);
  Serial.print(",");
  Serial.println(Z);


  delay(100);
}
