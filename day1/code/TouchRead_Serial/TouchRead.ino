// ESP32 Touch Test

void setup()
{
  Serial.begin(115200);
  delay(1000); // give me time to bring up serial monitor
  Serial.println("ESP32 Touch Test");
}

void loop()
{
  Serial.print("Touch 3 val: ");
  Serial.println(touchRead(T3));  // get value using T3
  Serial.print("Touch 5 val: ");
  Serial.println(touchRead(T5));  // get value using T5
  Serial.print("Touch 6 val: ");
  Serial.println(touchRead(T6));  // get value using T6
  Serial.print("Touch 7 val: ");
  Serial.println(touchRead(T7));  // get value using T7
  Serial.print("Touch 8 val: ");
  Serial.println(touchRead(T8));  // get value using T8
  Serial.print("Touch 9 val: ");
  Serial.println(touchRead(T9));  // get value using T9
  delay(1000);
}
