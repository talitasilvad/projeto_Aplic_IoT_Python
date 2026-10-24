#include "WiFi.h"
#include "HTTPClient.h"

const char* ssid = "nome_da_rede";
const char* senha = "senha_da_rede";

const int PIN_TRIG = 21;
const int PIN_ECHO = 5;

const char* servidor = "http://maquina_:8000";

void setup() {
  Serial.begin(115200);

  Serial.println("Conectando ao Wi-Fi...");
  WiFi.begin(ssid, senha);

  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
  }

  Serial.println();
  Serial.println("Wi-Fi conectado!");

  Serial.print("IP do ESP32: ");
  Serial.println(WiFi.localIP());

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  digitalWrite(PIN_TRIG, LOW);
  delay(50);
  Serial.println("--- Teste HC-SR04 e Wi-Fi ---");
}

void loop() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(5);
  
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  long duracao = pulseIn(PIN_ECHO, HIGH, 40000); 
  
  if (duracao == 0) {
    Serial.println("Fora de alcance"); 

  }else {
    float distancia_cm = (duracao * 0.0343) / 2.0;
    Serial.print("Distancia: ");
    Serial.print(distancia_cm);
    Serial.println(" cm");

    if (WiFi.status() == WL_CONNECTED) {

      HTTPClient http;

      String url = String(servidor) + "/distancia/" + String(distancia_cm);

      Serial.print("Enviando para: ");
      Serial.println(url);

      http.begin(url);

      int codigo = http.GET();

      if (codigo > 0) {

        Serial.print("Resposta do FastAPI: ");
        Serial.println(codigo);

        String resposta = http.getString();

        Serial.println(resposta);

      } else {

        Serial.print("Erro na requisicao: ");
        Serial.println(codigo);
      }

      http.end();
    }
  }

  delay(500);
}