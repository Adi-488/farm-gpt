# app.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, confloat
import pandas as pd
from fertilizer_recommendation import recommend_fertilizer

CSV_PATH = "D:\\Intellify Hackathon\\NutriGuide Datasets\\fertilizer_data.csv"  # internal, not provided by the client

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load once before serving requests
    app.state.crop_df = pd.read_csv(CSV_PATH)
    yield
    # No special shutdown needed

app = FastAPI(title="Sustainable Farming API", lifespan=lifespan)

# Allow React/Vite dev origin; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FertilizerRequest(BaseModel):
    crop: str
    actual_N: confloat(ge=0)
    actual_P: confloat(ge=0)
    actual_K: confloat(ge=0)

class FertilizerItem(BaseModel):
    name: str
    amount_kg_per_hectare: float
    stage: str

class FertilizerResponse(BaseModel):
    fertilizer_recommendation: list[FertilizerItem]

@app.post("/api/fertilizer/recommend", response_model=FertilizerResponse)
def api_recommend(req: FertilizerRequest):
    result = recommend_fertilizer(
        crop=req.crop,
        actual_N=req.actual_N,
        actual_P=req.actual_P,
        actual_K=req.actual_K,
        df=app.state.crop_df,  # use preloaded internal CSV
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result