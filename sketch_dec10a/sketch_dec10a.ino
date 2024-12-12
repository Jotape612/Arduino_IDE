#include <IOXhop_FirebaseESP32.h>
#include <IOXhop_FirebaseStream.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>
#include <LiquidCrystal.h>
#include <WiFi.h>
#include "HX711.h"


// Configurações do Firebase
#define FIREBASE_HOST "https://esp32-6fe25-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "YZ1HtCti4AYGSNsOgiGFhzpqZxrcPm7hEthFDJUQ"
#define WIFI_SSID = "teste1"
#define WIFI_PASSWORD = "123456"


// Pinos do LCD (RS, E, D4, D5, D6, D7) - ESP32
LiquidCrystal lcd(26, 25, 33, 32, 35, 34);


#define LEDR 13  // LED Vermelho
#define LEDG 12  // LED Verde
#define DT_LC 27 // Data do HX711
#define SCK_LC 14 // Clock do HX711

#define PESO_MAXIMO 50.0 

WiFiServer server(80); 
HX711 scale;

FirebaseData firebaseData;

void setup() {
  
  pinMode(LEDR, OUTPUT);
  pinMode(LEDG, OUTPUT);

  lcd.begin(16, 2);

  Serial.begin(115200);

  // Conecta no WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("WiFi Conectado!");

  // Inicializa o sensor
  scale.begin(DT_LC, SCK_LC);
  scale.set_scale(470);  
  scale.tare();  // serve pra zerar o peso

  // Inicializando o Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  server.begin(); // Inicializa o servidor
}

void loop() {
  // Lê o peso
  long weight = scale.get_units(10);  // Define a média de leituras, coloquei 10

  // Envia para o Firebase
  Firebase.setFloat(firebaseData, "/peso", weight);

  if (firebaseData.error()) {
    Serial.print("Erro ao enviar para o Firebase: ");
    Serial.println(firebaseData.errorReason());
  } else {
    Serial.print("Peso enviado para o Firebase: ");
    Serial.println(weight);
  }

  // Cálculo da porcentagem do estoque
  int porcentagem_estoque = (weight * 1.125 / PESO_MAXIMO) * 100;
  porcentagem_estoque = constrain(porcentagem_estoque, 0, 100); 

  // Controle dos LEDs
  if (porcentagem_estoque <= 25) {
    digitalWrite(LEDR, HIGH); // Acende o LED vermelho
    digitalWrite(LEDG, LOW);  // Apaga o LED verde
  } else {
    digitalWrite(LEDR, LOW);  // Apaga o LED vermelho
    digitalWrite(LEDG, HIGH); // Acende o LED verde
  }

  // Exibe o peso e a porcentagem do estoque no LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Peso: ");
  lcd.print(weight * 1.119, 2);  
  lcd.print(" kg");
  lcd.setCursor(0, 1);
  lcd.print("Estoque: ");
  lcd.print(porcentagem_estoque);
  lcd.print("%");

  // Exibe o peso e a porcentagem do estoque no Serial
  Serial.print("Peso: ");
  Serial.print(weight * 1.119, 2);  
  Serial.print(" kg | Estoque: ");
  Serial.print(porcentagem_estoque);
  Serial.println("%");

  // Verifica se há um cliente conectado
  WiFiClient client = server.available();


  if (client) {
    Serial.println("Cliente conectado");
    String request = client.readStringUntil('\r');
    client.flush();

    client.print("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n");
    client.print("<!DOCTYPE HTML>");
    client.print("<html>");
    client.print("<h1>Dados da Balança</h1>");
    client.print("<p>Peso: ");
    client.print(weight * 1.119, 2);
    client.print(" kg</p>");
    client.print("<p>Estoque: ");
    client.print(porcentagem_estoque);
    client.print("%</p>");
    client.print("</html>");
    client.stop();
    Serial.println("Cliente desconectado");
  }

  delay(5000);  // Aguarda 5 segundos antes de ler o peso novamente
}