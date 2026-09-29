import urllib.request
import json

class DemoNowcastModel:
    def predict(self, lat: float, lon: float):
        try:
            # Open-Meteo se REAL-TIME weather data fetch karna
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,cape,precipitation"
            req = urllib.request.Request(url, headers={'User-Agent': 'StormSight-SIH'})
            
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode())
                current = data.get("current", {})
                
                # Real Values
                temp = current.get("temperature_2m", 25.0)
                hum = current.get("relative_humidity_2m", 50.0)
                cape = current.get("cape", 0.0)
                precip = current.get("precipitation", 0.0)
                
                # Real Data par based Heuristic Model
                # Jyada CAPE aur Humidity ka matlab Storm ke chances jyada hain
                storm_prob = 0.05
                if cape > 1500 and hum > 70:
                    storm_prob = 0.85
                elif cape > 1000 and hum > 60:
                    storm_prob = 0.55
                elif cape > 500 or precip > 0:
                    storm_prob = 0.35
                    
                lightning_prob = storm_prob * 0.8
                
                risk = "LOW"
                if storm_prob > 0.75: risk = "SEVERE"
                elif storm_prob > 0.5: risk = "HIGH"
                elif storm_prob > 0.3: risk = "MODERATE"

                return {
                    "lat": lat,
                    "lon": lon,
                    "storm_probability": storm_prob,
                    "lightning_probability": lightning_prob,
                    "confidence": 0.85, # Real data use kar rahe hain toh confidence high hai
                    "risk_level": risk,
                    "temperature": temp,
                    "humidity": hum,
                    "cape": round(cape, 1),
                    "cin": 0.0, 
                    "radar_reflectivity": round(precip * 10, 1), # Rain ko radar base maan rahe hain
                    "factors": {
                        "Humidity": int(hum),
                        "CAPE Intensity": min(int((cape/3000)*100), 100),
                        "Precipitation": min(int(precip*10), 100)
                    }
                }
        except Exception as e:
            # Agar API fail ho jaye internet issue se, toh safe fallback
            return {
                "lat": lat, "lon": lon, "storm_probability": 0.1, "lightning_probability": 0.05,
                "confidence": 0.5, "risk_level": "LOW", "temperature": 25.0, "humidity": 50.0,
                "cape": 100, "cin": 0, "radar_reflectivity": 0, "factors": {"System": 0}
            }
