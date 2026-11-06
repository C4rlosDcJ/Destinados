# Destinados

Guia de Consulta Turistica Multi-API - Actividad 19

* **Estudiante:** Carlos D.
* **Docente Evaluador:** R. Vinicio Camacho
* **Curso:** Desarrollo de Aplicaciones Moviles (10° Cuatrimestre)
* **Plataforma:** React Native + Expo (Diseno editorial premium / Modo Claro)
* **Iconografia:** `@expo/vector-icons` (Feather e Ionicons vectoriales)
* **Fotografia:** Unsplash Travel CDN + Wikimedia REST Oficial

---

## 1. Experiencia de Usuario (UX / UI)

La aplicacion ha sido diseñada con base en las referencias de experiencia de usuario de plataformas consolidadas como **Airbnb**, **Google Travel**, **Apple Weather** y **Monocle City Guides**:

* **Fotografia Real de Destinos:** Carrusel y portadas con imagenes ajustadas de borde a borde para destinos como *Tokio*, *Paris*, *Cancun*, *Roma*, *Nueva York*, *Madrid*, *Londres*, *Kioto*, *El Cairo*, *Oaxaca*, *Canada* y mas.
* **Galeria Multi-Foto Interactiva:** Cada destino cuenta con postales iconicas conmutables con un toque y contraste optimizado.
* **Iconografia Vectorial Nativa:** Integracion limpia de iconos SVG sin emoticonos ni caracteres emoji (brujula, termometro, viento, humedad, mapas, moneda, calendario).
* **Integracion con Google Maps:** Boton interactivo para explorar directamente las coordenadas geograficas calculadas en la aplicacion oficial de Google Maps.
* **Calculadora de Presupuesto:** Permite convertir importes en dolares (USD) con botones predefinidos ($25, $50, $100, $500) a la moneda del pais seleccionado.
* **Pronostico Meteorologico Extendido:** 7 dias con clasificacion segun codigo WMO y barras de rango termico.
* **Lectura Editorial Expandible:** Reseña enciclopedica de Wikipedia con control interactivo "Leer reseña completa" y enlace externo.

---

## 2. Identificacion de APIs y Endpoints

| Servicio | Proveedor | Endpoint Base HTTPS | Metodo | Parametros Clave | Formato |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API 1: Geocodificacion** | Open-Meteo Geocoding | `https://geocoding-api.open-meteo.com/v1/search` | GET | `name`, `count=5`, `language=es`, `format=json` | JSON Array |
| **API 2: Meteorologia** | Open-Meteo Forecast | `https://api.open-meteo.com/v1/forecast` | GET | `latitude`, `longitude`, `current`, `daily`, `timezone=auto` | JSON Object |
| **API 3: Guia Cultural** | Wikimedia REST | `https://es.wikipedia.org/api/rest_v1/page/summary/{title}` | GET | `{title}` en ruta, Header `User-Agent` | JSON Object |
| **API 4: Divisas FX** | Frankfurter FX (BCE) | `https://api.frankfurter.app/latest` | GET | `from=USD` | JSON Object |

---

## 3. Pruebas de Validacion y Tolerancia a Fallos

Ejecutables con `node test_verification.js`:

* **Prueba 1 (HTTPS Seguro):** 100% de endpoints operan sobre canal criptografico TLS.
* **Prueba 2 (Ubicacion 1 - Tokio, Japon):** Coordenadas 35.6895, 139.69171 | Clima | Reseña e imagenes | Tasa JPY.
* **Prueba 3 (Ubicacion 2 - Cancun, Mexico):** Coordenadas 21.17429, -86.84656 | Clima | Reseña turistica | Tasa MXN.
* **Prueba 4 (Prueba de indisponibilidad):** Error 503 en el servicio de clima con el resto de la informacion disponible (degradacion elegante).
* **Prueba 5 (Falla en cascada):** Falla en API 1; el orquestador omite preventivamente las peticiones secundarias para evitar consultas huerfanas sin coordenadas.

---

## 4. Instrucciones de Ejecucion

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar en dispositivo movil (Expo Go / Emulador):**
   ```bash
   npx expo start
   ```

3. **Iniciar en navegador web:**
   ```bash
   npx expo start --web
   ```

4. **Ejecutar suite de pruebas:**
   ```bash
   node test_verification.js
   ```
