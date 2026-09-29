import math
import time

class DemoNowcastModel:
    def predict(self, lat: float, lon: float):
        t = time.time() / 1000
        storm_prob = min(max(abs(math.sin(lat * 10 + t) + math.cos(lon * 10 + t)) / 2 + 0.1, 0.0), 1.0)
        lightning_prob = storm_prob * 0.85
        
        risk = "LOW"
        if storm_prob > 0.75: risk = "SEVERE"
        elif storm_prob > 0.5: risk = "HIGH"
        elif storm_prob > 0.3: risk = "MODERATE"

        return {
            "lat": lat,
            "lon": lon,
            "storm_probability": storm_prob,
            "lightning_probability": lightning_prob,
            "confidence": 0.75 + (storm_prob * 0.2),
            "risk_level": risk,
            "temperature": round(28.5 + (storm_prob * -4), 1),
            "humidity": round(60 + (storm_prob * 35), 1),
            "cape": round(1500 + (storm_prob * 2500), 0),
            "cin": round(-150 + (storm_prob * 100), 0),
            "radar_reflectivity": round(20 + (storm_prob * 45), 1),
            "factors": {
                "Humidity": int((60 + (storm_prob * 35))),
                "CAPE": int(min((1500 + (storm_prob * 2500))/4000 * 100, 99)),
                "Lightning Trend": int(lightning_prob * 100)
            }
        }
