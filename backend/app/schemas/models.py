from pydantic import BaseModel
from typing import List

class LocationRequest(BaseModel):
    lat: float
    lon: float

class NowcastResponse(BaseModel):
    lat: float
    lon: float
    storm_probability: float
    lightning_probability: float
    confidence: float
    risk_level: str
    temperature: float
    humidity: float
    cape: float
    cin: float
    radar_reflectivity: float
    factors: dict
