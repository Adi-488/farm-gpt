from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv


def _climate_factor(temperature: float, humidity: float) -> float:
    # Climate adjustment factor based on temperature and humidity
    factor = 1 + 0.02 * (temperature - 25) - 0.005 * (humidity - 60)
    return max(0.8, min(1.2, factor))  # clamp between 0.8 and 1.2


def _load_crop_data(path: str) -> dict:
    crop_data = {}
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            val = row["Water_mm_per_day"].strip()
            if '-' in val:
                low, high = map(float, val.split('-'))
                avg_val = (low + high) / 2
            else:
                avg_val = float(val)
            crop_data[row["Crop"].strip().lower()] = avg_val
    return crop_data


class IrrigationScheduler:
    def __init__(self, data_path: str):
        self.crop_data = _load_crop_data(data_path)

    def recommend(
        self,
        crop: str,
        temperature: float,
        humidity: float,
        rainfall: float,
        area_hectares: float = 1.0,
    ) -> dict:
        crop_key = crop.lower()
        if crop_key not in self.crop_data:
            return {"error": f"No data for crop '{crop}'"}

        base_mm = self.crop_data[crop_key]
        climate_adj = _climate_factor(temperature, humidity)
        adjusted_mm = base_mm * climate_adj
        net_mm = max(0, adjusted_mm - rainfall)

        liters_per_hectare = net_mm * 10000  # 1mm = 10,000 L/ha
        liters_total = liters_per_hectare * area_hectares

        if net_mm == 0:
            frequency = "No irrigation needed"
        elif net_mm > 6:
            frequency = "Daily"
        elif net_mm > 3:
            frequency = "Every 2 days"
        else:
            frequency = "Every 3 days"

        return {
            "crop": crop,
            "recommended_irrigation": f"Give {net_mm:.1f} mm/day (~ {liters_per_hectare:.0f} L/hectare/day)",
            "total_liters_for_area": round(liters_total, 0),
            "frequency": frequency,
            "note": "Irrigation need adjusts automatically with rainfall and weather.",
        }


DATA_PATH = "D:\\Intellify Hackathon\\AquaSense Datasets\\crop_water_req.csv"  # Adjust path


app = FastAPI(title="Sustainable Farming API - Irrigation Module")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IrrigationRequest(BaseModel):
    crop: str
    temperature: float
    humidity: float
    rainfall: float
    area_hectares: float = 1.0


@app.on_event("startup")
def startup_event():
    global scheduler
    scheduler = IrrigationScheduler(DATA_PATH)


@app.post("/api/irrigation/recommend")
def api_recommend_irrigation(req: IrrigationRequest):
    result = scheduler.recommend(
        crop=req.crop,
        temperature=req.temperature,
        humidity=req.humidity,
        rainfall=req.rainfall,
        area_hectares=req.area_hectares,
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
