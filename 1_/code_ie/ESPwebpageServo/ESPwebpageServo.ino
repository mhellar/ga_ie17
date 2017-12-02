#include <ESP8266WiFi.h>
const char* ssid = "extreme"; //wifi ssid / wifi name
const char* password = "extreme!!!"; //wifi password
int ledPin = LED_BUILTIN;


#include <Servo.h>

Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards


WiFiServer server(80);
void setup() {

  myservo.attach(5);
  Serial.begin(115200);
  delay(10);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  // Start the server
  server.begin();
  Serial.println("Server started");
  // Print the IP address
  Serial.print("Use this URL to connect: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
}
void loop() {
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  // Wait until the client sends some data
  Serial.println("new client");
  while (!client.available()) {
    delay(1);
  }
  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();
  // Match the request
  int value = LOW;
  if (request.indexOf("/SERVO=0") != -1)  {
    digitalWrite(ledPin, HIGH);
    value = 0;
    myservo.write(0);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  if (request.indexOf("/SERVO=45") != -1)  {
    digitalWrite(ledPin, HIGH);
    value = 45;
    myservo.write(45);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  if (request.indexOf("/SERVO=90") != -1)  {
    digitalWrite(ledPin, HIGH);
    value = 90;
    myservo.write(90);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  if (request.indexOf("/SERVO=180") != -1)  {
    digitalWrite(ledPin, LOW);
    value = 180;
    myservo.write(180);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  unsigned long time = millis();
  // Set ledPin according to the request
  //digitalWrite(ledPin, value);
  // Return the response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println(""); //  do not forget this one
  client.println("<!DOCTYPE HTML>");
  client.println("<html>");
  client.print("<body style='background: #00979C'>");
  client.println("<h1 align ='center'>");
  client.println("<font-color='red'>");
  client.println("Interactive Environments");
  client.println("</font>");
  client.println("</h1>");
  client.println("<bg color ='#00ff00'>");
  client.println("</bg>");
  client.println("<p align ='center'>");
  client.print("S3rvo Master ");
  client.println("</p>");
  client.println("<p align ='center'>");
  client.print(value);
  client.println("</p>");

  client.println("<br><br>");
  client.println("<p align ='center'>");
  client.println("<a  href=\"/SERVO=0\"\"><button>0</button></a>");
  client.println("<a  href=\"/SERVO=45\"\"><button>45</button></a><br />");
  client.println("<a  href=\"/SERVO=90\"\"><button>90</button></a>");
  client.println("<a  href=\"/SERVO=180\"\"><button>180</button></a><br />");
  client.println("</p>");
  client.println("<p>");
  client.println("<marquee direction='right'>");
  client.println("</marquee>");
  client.println("</p>");
  client.println("</body>");
  client.println("</html>");
  delay(1);
  Serial.println("Client disonnected");
  Serial.println("");
}
