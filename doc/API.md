### API : https://github.com/mivek/MetarParser

# Le principe de base
Une API, c'est comme un serveur de restaurant : tu passes une commande (une requête), et il te ramène un plat (une réponse). Tout ça se passe via une URL.

## L'API qu'on va utiliser
C'est celle d'Aviation Weather Center, gratuite, sans clé :
https://aviationweather.gov/api/data/metar?ids=LFPG&format=json
Décortiquons cette URL :

https://aviationweather.gov/api/data/metar → l'adresse du service
?ids=LFPG → le paramètre : le code OACI demandé
&format=json → on veut la réponse au format JSON (du texte structuré)


Ce que l'API renvoie (JSON)
```JSON
json[{
  "icaoId": "LFPG",
  "wdir": 190,
  "wspd": 5,
  "wgst": 12,
  "cldCvg1": "FEW",
  "cldBas1": 4000,
  "cldCvg2": "SCT",
  "cldBas2": 8600,
  "rawOb": "LFPG 131830Z 19005KT..."
}]
```
C'est un tableau ([...]) contenant un objet ({...}). Les champs qui nous intéressent :

ChampSignificationwdirDirection du vent en degréswspdVitesse du vent en nœudswgstVitesse des rafales (null si aucune)cldCvg1/2/3Couverture nuageuse (FEW, SCT, BKN, OVC…)cldBas1/2/3Hauteur de la base des nuages en piedsrawObLe METAR brut complet

**Comment l'appeler en JavaScript**
```javascript
// 1. On construit l'URL avec le code OACI voulu
const icao = "LFPG";
const url = `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`;

// 2. On envoie la requête
const response = await fetch(url);

// 3. On transforme la réponse en objet JavaScript
const data = await response.json();

// 4. On lit les données (c'est un tableau, on prend le 1er élément)
const metar = data[0];
console.log(metar.wdir); // → 190
console.log(metar.wspd); // → 5
```
Les deux mots-clés importants

- **fetch(url)** → envoie la requête à l'API
- **await** → attend la réponse avant de continuer (car ça prend quelques millisecondes)

## Depuis Java 11 : HttpClient.

### 1. Faire la requête HTTP en Java
```Java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String icao = "LFPG";
String url = "https://aviationweather.gov/api/data/metar?ids=" + icao + "&format=json";

HttpClient client = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .GET()
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

String json = response.body(); // → le JSON brut en String
```
### 2. Lire le JSON
Java ne lit pas le JSON nativement. Il faut une bibliothèque. La plus simple est org.json. Dans ton pom.xml (si tu utilises Maven) :
```xml
<dependency>
    <groupId>org.json</groupId>
    <artifactId>json</artifactId>
    <version>20240303</version>
</dependency>
</parameter>
```

Ensuite pour lire les données :

```java
import org.json.JSONArray;
import org.json.JSONObject;

JSONArray array = new JSONArray(json);
JSONObject metar = array.getJSONObject(0); // premier élément

int windDir   = metar.getInt("wdir");
int windSpeed = metar.getInt("wspd");
String cloud1 = metar.optString("cldCvg1", "N/A"); // optString évite les erreurs si le champ est absent
int cloudBase = metar.optInt("cldBas1", 0);
```

### 3. Afficher dans JavaFX
La règle importante en JavaFX : on ne peut pas modifier l'interface depuis un thread autre que le thread JavaFX. Comme la requête HTTP est longue, on la fait dans un Thread séparé, puis on revient sur le bon thread avec **Platform.runLater()**.

```Java
// Tes labels déclarés dans le contrôleur
@FXML private Label labelVent;
@FXML private Label labelNuages;

// La méthode qui récupère et affiche
private void fetchMetar(String icao) {
    new Thread(() -> {
        try {
            // 1. Requête
            String url = "https://aviationweather.gov/api/data/metar?ids=" + icao + "&format=json";
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // 2. Lecture JSON
            JSONArray array = new JSONArray(response.body());
            JSONObject metar = array.getJSONObject(0);

            String vent   = metar.getInt("wdir") + "° / " + metar.getInt("wspd") + " kt";
            String nuages = metar.optString("cldCvg1", "N/A") + " à " + metar.optInt("cldBas1") + " ft";

            // 3. Mise à jour de l'interface (obligatoirement ici)
            Platform.runLater(() -> {
                labelVent.setText(vent);
                labelNuages.setText(nuages);
            });

        } catch (Exception e) {
            Platform.runLater(() -> labelVent.setText("Erreur : " + e.getMessage()));
        }
    }).start();
}
```
```
Résumé du flux
Bouton cliqué
    → new Thread()          (pour ne pas bloquer l'UI)
        → HttpClient.send() (requête vers l'API)
        → JSONArray         (lecture du JSON)
        → Platform.runLater (retour sur le thread JavaFX)
            → label.setText (mise à jour de l'interface)
```