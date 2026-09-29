from fastapi import APIRouter
from app.schemas.models import LocationRequest, NowcastResponse
from app.services.ml import DemoNowcastModel
import datetime
import uuid

router = APIRouter()
model = DemoNowcastModel()

@router.post("/nowcast/run", response_model=NowcastResponse)
def run_nowcast(req: LocationRequest):
    return model.predict(req.lat, req.lon)

@router.get("/alerts")
def get_alerts():
    return [
        {
            "id": str(uuid.uuid4()),
            "location": "Bhopal Region",
            "severity": "SEVERE",
            "probability": 82.5,
            "message": "Rapid increase in lightning activity. High convective intensity.",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
    ]

@router.get("/system/status")
def get_system_status():
    return {"status": "ONLINE", "mode": "DEMO"}
