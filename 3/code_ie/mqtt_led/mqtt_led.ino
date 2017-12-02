#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_NeoPixel.h>


#define NEO_PIN 2

#define NUM_LEDS 16


Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, NEO_PIN, NEO_GRB + NEO_KHZ800);


// Update these with values suitable for your network.

const char* ssid = "Wired2";
const char* password = "12!trout";
const char* mqtt_server = "10.0.0.193";

float red = 0.0;
float green = 0.0;
float blue = 0.0;
float white = 0.0;
bool fading = 0;
int targetN = 0;

int targetRed, targetBlue, targetGreen, targetWhite;

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void setup() {
  Serial.begin(115200);
  strip.begin();
  strip.setPixelColor(0, strip.Color(100, 0, 0, 0));

  strip.show(); // Initialize all pixels to 'off'
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
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
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}



void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    message += (char)payload[i];
  }
  Serial.println();

  String thistopic = String(topic);
  Serial.println(thistopic);

  // BLOCK COLOUR - rrrgggbbbwww
  if (thistopic == "/leds") {
    Serial.println("Setting block color");
    Serial.println(message);

    targetRed = message.substring(0, 3).toInt();
    targetGreen = message.substring(3, 6).toInt();
    targetBlue = message.substring(6, 9).toInt();
    targetN = message.substring(10).toInt() / 10;
    if (targetN > 0) {
      fading = true;
    } else {
      for (uint16_t i = 0; i < strip.numPixels(); i++) {
        strip.setPixelColor(i, targetRed, targetGreen, targetBlue);
      }
      strip.show();
      red = targetRed;
      green = targetGreen;
      blue = targetBlue;
    }


  }

}


void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESPClient", "/leds", 0, false, "disconnected")) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("leds", "connected");
      // ... and resubscribe
      client.subscribe("/leds");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  if (fading) {
    int n = 0;
    float deltaRed = (targetRed - red) / targetN;
    float deltaGreen = (targetGreen - green) / targetN;
    float deltaBlue = (targetBlue - blue) / targetN;
    float deltaWhite = (targetWhite - white) / targetN;

    while (fading) {
      red += deltaRed;
      green += deltaGreen;
      blue += deltaBlue;
      white += deltaWhite;
      for (uint16_t i = 0; i < strip.numPixels(); i++) {
        strip.setPixelColor(i, (int)red, (int)green, (int)blue, (int)white);
      }
      strip.show();
      n += 1;
      if (n >= targetN) {
        n = 0;
        fading = false;
      }
      delay(10);
      client.loop();

    }

  }

  yield();
}


