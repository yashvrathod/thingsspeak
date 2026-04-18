'use client'

import Link from 'next/link'
import { 
  BookOpen, 
  Code, 
  Key, 
  Radio, 
  Wifi, 
  Database,
  ArrowRight,
  Copy,
  Check,
  Lightbulb,
  FileJson,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

function CodeBlock({ code, language = 'cpp' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <Button variant="ghost" size="sm" onClick={copy} className="h-8 w-8 p-0">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className="text-foreground">{code}</code>
      </pre>
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Activity className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
            <h1 className="font-bold text-lg tracking-tight">Pulse Docs</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Button asChild size="sm">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Getting Started with Pulse</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how to connect your Arduino, ESP32, or Raspberry Pi to collect and visualize sensor data with Pulse
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Card className="hover:border-accent/50 transition-colors">
            <CardHeader className="pb-3">
              <Radio className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">Understanding Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Learn what channels are and how to organize your IoT data</p>
            </CardContent>
          </Card>
          <Card className="hover:border-accent/50 transition-colors">
            <CardHeader className="pb-3">
              <Key className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">How to create and use API keys to authenticate your devices</p>
            </CardContent>
          </Card>
          <Card className="hover:border-accent/50 transition-colors">
            <CardHeader className="pb-3">
              <Code className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">Arduino Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ready-to-use code for ESP32, ESP8266, and Arduino</p>
            </CardContent>
          </Card>
        </div>

        {/* What are Channels? */}
        <section id="channels" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Radio className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">What are Channels?</h2>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground mb-4">
              A <strong>Channel</strong> is like a container for your IoT device data. Think of it as a spreadsheet 
              where each row is a data point and each column is a different sensor reading.
            </p>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Channel Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <Badge variant="secondary" className="mb-2">field1</Badge>
                    <p className="text-muted-foreground">Temperature</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <Badge variant="secondary" className="mb-2">field2</Badge>
                    <p className="text-muted-foreground">Humidity</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <Badge variant="secondary" className="mb-2">field3</Badge>
                    <p className="text-muted-foreground">Pressure</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <Badge variant="secondary" className="mb-2">field4-8</Badge>
                    <p className="text-muted-foreground">More sensors</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Each channel supports up to <strong>8 data fields</strong> (field1 through field8), 
                  plus optional location data (latitude, longitude, elevation) and a status message.
                </p>
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold mb-3">Example Use Cases</h3>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-500" />
                <span><strong>Weather Station:</strong> field1=Temperature, field2=Humidity, field3=Pressure, field4=Wind Speed</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-500" />
                <span><strong>Smart Home:</strong> field1=Room Temp, field2=Light Level, field3=Motion (0/1), field4=Energy Usage</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-500" />
                <span><strong>Agriculture:</strong> field1=Soil Moisture, field2=Air Temp, field3=pH Level, field4=Light Hours</span>
              </li>
            </ul>
          </div>
        </section>

        {/* API Keys */}
        <section id="api-keys" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Understanding API Keys</h2>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground mb-4">
              API keys are like passwords for your devices. Each channel has two types of keys:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-green-500" />
                    <CardTitle className="text-base">Write API Key</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Used by your device to <strong>send data</strong> to the channel.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Keep this secret! Anyone with this key can add data to your channel.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <CardTitle className="text-base">Read API Key</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Used to <strong>retrieve data</strong> from the channel (for other apps/scripts).
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Can be public if you want to share your data.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">Where to find your API keys</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Go to your <Link href="/dashboard" className="underline">Dashboard</Link> → 
                    Select a Channel → Click the &quot;API Keys&quot; tab. You can also regenerate keys if they are compromised.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Arduino Code Examples */}
        <section id="arduino" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Arduino & ESP32 Code Examples</h2>
          </div>

          <div className="space-y-8">
            {/* ESP32 Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Badge variant="outline">ESP32</Badge>
                Complete Weather Station Example
              </h3>
              <CodeBlock code={`#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Your channel's Write API Key (find this in your Dashboard)
const char* writeApiKey = "YOUR_WRITE_API_KEY_HERE";

// Platform server URL
const char* serverUrl = "https://your-domain.com/api/data/upload";

// DHT sensor setup
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Read sensor data
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Check if readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(60000); // Wait 1 minute before retry
    return;
  }
  
  // Send data to platform
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Build JSON payload
    String jsonPayload = "{";
    jsonPayload += "\\"write_api_key\\":\\"" + String(writeApiKey) + "\\",";
    jsonPayload += "\\"field1\\":" + String(temperature) + ",";
    jsonPayload += "\\"field2\\":" + String(humidity) + ",";
    jsonPayload += "\\"status\\":\\"Sensor data uploaded\\"";
    jsonPayload += "}";
    
    Serial.println("Sending: " + jsonPayload);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
  
  // Wait 30 seconds before next reading
  delay(30000);
}`} />
            </div>

            {/* ESP8266 Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Badge variant="outline">ESP8266</Badge>
                Basic Data Upload
              </h3>
              <CodeBlock code={`#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* writeApiKey = "YOUR_WRITE_API_KEY_HERE";
const char* serverUrl = "https://your-domain.com/api/data/upload";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi connected");
}

void sendData(float value1, float value2) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    String payload = "{\\"write_api_key\\":\\"" + String(writeApiKey) + 
                   "\\",\\"field1\\":" + String(value1) + 
                   ",\\"field2\\":" + String(value2) + "}";
    
    int httpCode = http.POST(payload);
    Serial.println("HTTP code: " + String(httpCode));
    http.end();
  }
}

void loop() {
  // Read your sensors here
  float sensor1 = analogRead(A0);  // Example: light sensor
  float sensor2 = random(0, 100); // Example: random value
  
  sendData(sensor1, sensor2);
  
  delay(15000); // Send every 15 seconds
}`} />
            </div>

            {/* Arduino with Ethernet */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Badge variant="outline">Arduino + Ethernet</Badge>
                Using Ethernet Shield
              </h3>
              <CodeBlock code={`#include <SPI.h>
#include <Ethernet.h>
#include <ArduinoJson.h>

// Ethernet shield MAC address
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

const char* writeApiKey = "YOUR_WRITE_API_KEY_HERE";
const char* server = "your-domain.com";

EthernetClient client;

void setup() {
  Serial.begin(9600);
  
  // Start Ethernet connection
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
  }
  
  // Give the Ethernet shield time to initialize
  delay(1000);
  Serial.println("Ethernet connected");
}

void sendData(float temp, float humidity) {
  StaticJsonDocument<256> doc;
  doc["write_api_key"] = writeApiKey;
  doc["field1"] = temp;
  doc["field2"] = humidity;
  doc["status"] = "OK";
  
  String jsonStr;
  serializeJson(doc, jsonStr);
  
  if (client.connect(server, 80)) {
    client.println("POST /api/data/upload HTTP/1.1");
    client.println("Host: your-domain.com");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(jsonStr.length());
    client.println("Connection: close");
    client.println();
    client.println(jsonStr);
    
    Serial.println("Data sent: " + jsonStr);
  } else {
    Serial.println("Connection failed");
  }
  
  client.stop();
}

void loop() {
  // Read sensors
  float temperature = 25.5; // Replace with actual sensor reading
  float humidity = 60.0;    // Replace with actual sensor reading
  
  sendData(temperature, humidity);
  
  delay(60000); // Send every minute
}`} />
            </div>
          </div>
        </section>

        {/* HTTP API Documentation */}
        <section id="api" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileJson className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">HTTP API Reference</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">POST /api/data/upload</CardTitle>
                <Badge>Data Upload</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload sensor data to your channel. This is the main endpoint your devices will use.
              </p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Request Body (JSON)</h4>
                <CodeBlock language="json" code={`{
  "write_api_key": "your_channel_write_key",
  "field1": 25.5,
  "field2": 60.0,
  "field3": 1013.25,
  "field4": null,
  "field5": 0,
  "field6": 100,
  "field7": 3.3,
  "field8": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "elevation": 10,
  "status": "Sensor reading successful"
}`} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Parameter</th>
                        <th className="text-left py-2 px-4">Type</th>
                        <th className="text-left py-2 px-4">Required</th>
                        <th className="text-left py-2 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono text-accent">write_api_key</td>
                        <td className="py-2 px-4">string</td>
                        <td className="py-2 px-4">Yes</td>
                        <td className="py-2 px-4">Your channel&apos;s write API key</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">field1-field8</td>
                        <td className="py-2 px-4">number/null</td>
                        <td className="py-2 px-4">No</td>
                        <td className="py-2 px-4">Up to 8 sensor values</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">latitude</td>
                        <td className="py-2 px-4">number</td>
                        <td className="py-2 px-4">No</td>
                        <td className="py-2 px-4">GPS latitude</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">longitude</td>
                        <td className="py-2 px-4">number</td>
                        <td className="py-2 px-4">No</td>
                        <td className="py-2 px-4">GPS longitude</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-mono">status</td>
                        <td className="py-2 px-4">string</td>
                        <td className="py-2 px-4">No</td>
                        <td className="py-2 px-4">Status message (max 255 chars)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Success Response (201)</h4>
                <CodeBlock language="json" code={`{
  "success": true,
  "entry_id": "cl...",
  "channel_id": "cl...",
  "created_at": "2024-01-15T10:30:00.000Z"
}`} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Getting &quot;Invalid API key&quot; error?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  <li>Make sure you&apos;re using the <strong>Write API Key</strong>, not the Read API Key</li>
                  <li>Check that the key hasn&apos;t expired (keys can have expiration dates)</li>
                  <li>Verify there are no extra spaces in your API key string</li>
                  <li>If you regenerated keys, update your device code with the new key</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">WiFi won&apos;t connect?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  <li>Double-check your WiFi SSID and password (case-sensitive!)</li>
                  <li>Ensure your 2.4GHz WiFi is enabled (most IoT devices don&apos;t support 5GHz)</li>
                  <li>Try moving the device closer to your router</li>
                  <li>Check if your router has MAC filtering enabled</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data not showing in dashboard?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  <li>Open the Serial Monitor to see if HTTP requests are succeeding</li>
                  <li>Check the HTTP response code - 201 means success</li>
                  <li>Make sure you&apos;re sending numbers, not strings, for field values</li>
                  <li>Try the built-in Device Simulator to test your channel</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="text-center py-12 border-t border-border">
          <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Create your first channel, get your API keys, and start sending data from your IoT devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need more help? Check out our <Link href="/dashboard/projects" className="underline">Projects Library</Link> for complete tutorials.
          </p>
        </div>
      </footer>
    </div>
  )
}
