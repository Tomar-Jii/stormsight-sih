from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
import os

app = FastAPI(title="StormSight AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "StormSight AI Backend is Running!"}

@app.get("/health")
def health_check():
    return {"status": "SYSTEM ONLINE", "mode": "DEMO / SIMULATION"}
