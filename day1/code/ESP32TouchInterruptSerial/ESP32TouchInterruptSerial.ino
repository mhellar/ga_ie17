int threshold = 13;

bool touch3detected = false;
bool touch5detected = false;
bool touch6detected = false;
bool touch7detected = false;
bool touch8detected = false;
bool touch9detected = false;


void gotTouch3() {
  touch3detected = true;
}

void gotTouch5() {
  touch5detected = true;
}

void gotTouch6() {
  touch6detected = true;
}

void gotTouch7() {
  touch7detected = true;
}

void gotTouch8() {
  touch8detected = true;
}

void gotTouch9() {
  touch9detected = true;
}


void setup() {
  Serial.begin(115200);
  
  Serial.println("ESP32 Touch Interrupt Test");
  touchAttachInterrupt(T3, gotTouch3, threshold);
  touchAttachInterrupt(T5, gotTouch5, threshold);
  touchAttachInterrupt(T6, gotTouch6, threshold);
  touchAttachInterrupt(T7, gotTouch7, threshold);
  touchAttachInterrupt(T8, gotTouch8, threshold);
  touchAttachInterrupt(T9, gotTouch9, threshold);

}

void loop() {
  
  if (touch3detected) {
    touch3detected = false;
    Serial.println("Touch 3 detected");
    delay(500);
  }
  if (touch5detected) {
    touch5detected = false;
    Serial.println("Touch 5 detected");
    delay(500);
  }
  if (touch6detected) {
    touch6detected = false;
    Serial.println("Touch 6 detected");
    delay(500);
  }
  if (touch7detected) {
    touch7detected = false;
    Serial.println("Touch 7 detected");
    delay(500);
  }
  if (touch8detected) {
    touch8detected = false;
    Serial.println("Touch 8 detected");
    delay(500);
  }
  if (touch9detected) {
    touch9detected = false;
    Serial.println("Touch 9 detected");
    delay(500);
  }

}

