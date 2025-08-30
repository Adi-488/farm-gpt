from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import os
import traceback
import logging
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths to model files
MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")
ENCODERS_PATH = os.path.join(os.path.dirname(__file__), "label_encoders.pkl")

logger.info(f"Loading model from: {MODEL_PATH}")

try:
    # Load model
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    logger.info(f"Model loaded successfully. Type: {type(model)}")
    
    # Load scaler
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    logger.info("Scaler loaded successfully")
    
    # Load label encoders
    with open(ENCODERS_PATH, "rb") as f:
        encoders = pickle.load(f)
    logger.info("Label encoders loaded successfully")
    
    # Log model feature information
    if hasattr(model, 'feature_names_in_'):
        logger.info(f"Model expects features: {model.feature_names_in_}")
        logger.info(f"Number of features expected: {model.n_features_in_}")
    
except Exception as e:
    logger.exception("Failed to load model/scaler/encoders at startup")
    raise

app = FastAPI(title="Crop Recommender API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    state_name: str  # Changed to string for natural input
    crop_type: str   # Changed to string for natural input
    nitrogen: float
    phosphorus: float
    potassium: float
    pH: float
    rainfall: float
    temperature: float
    area_in_hectares: float
    production_in_tons: float
    yield_ton_per_hec: float

@app.get("/")
def root():
    return {"ok": True, "msg": "Crop API is running"}

@app.post("/predict")
def predict(data: InputData):
    try:
        # Encode categorical variables
        try:
            state_encoded = encoders['state'].transform([data.state_name])[0]
        except ValueError:
            # If state not found in training data, use a default or handle error
            logger.warning(f"Unknown state: {data.state_name}")
            state_encoded = 0  # or handle this case appropriately
            
        try:
            crop_type_encoded = encoders['crop_type'].transform([data.crop_type])[0]
        except ValueError:
            logger.warning(f"Unknown crop type: {data.crop_type}")
            crop_type_encoded = 0  # or handle this case appropriately
        
        # Raw features
        N, P, K = data.nitrogen, data.phosphorus, data.potassium
        ph, rain, temp = data.pH, data.rainfall, data.temperature
        area, prod, yld = data.area_in_hectares, data.production_in_tons, data.yield_ton_per_hec
        
        # Engineered features (exactly as in training)
        NPK_sum = N + P + K
        Production_per_area = prod / (area + 1)
        N_by_K = N / (K + 1)
        P_by_K = P / (K + 1)
        
        # Construct feature array in the exact order used during training
        features = np.array([[
            0,                    # Dummy feature (not used)
            state_encoded,        # State_Name (encoded)
            crop_type_encoded,    # Crop_Type (encoded)
            N,                    # N
            P,                    # P
            K,                    # K
            ph,                   # pH
            rain,                 # rainfall
            temp,                 # temperature
            area,                 # Area_in_hectares
            prod,                 # Production_in_tons
            yld,                  # Yield_ton_per_hec
            NPK_sum,              # NPK_sum (engineered)
            Production_per_area,  # Production_per_area (engineered)
            N_by_K,               # N_by_K (engineered)
            P_by_K                # P_by_K (engineered)
        ]])
        
        logger.info(f"Input shape: {features.shape}")
        
        # Apply scaling (same as used in training)
        features_scaled = scaler.transform(features)
        
        # Make prediction
        pred_encoded = model.predict(features_scaled)[0]
        
        # Decode prediction to crop name
        pred_crop_name = encoders['crop'].inverse_transform([pred_encoded])[0]
        
        return {
            "prediction": pred_crop_name,
            "prediction_encoded": int(pred_encoded),
            "success": True
        }
        
    except Exception as e:
        traceback.print_exc()
        logger.exception("Prediction failed")
        return {
            "error": "prediction failed", 
            "details": str(e),
            "success": False
        }

@app.get("/model-info")
def get_model_info():
    try:
        feature_names = getattr(model, "feature_names_in_", None)
        n_features = getattr(model, "n_features_in_", None)
        
        # Get available states and crop types
        available_states = list(encoders['state'].classes_)
        available_crop_types = list(encoders['crop_type'].classes_)
        available_crops = list(encoders['crop'].classes_)
        
        return {
            "model_type": str(type(model)),
            "n_features": n_features,
            "feature_names": feature_names.tolist() if feature_names is not None else None,
            "available_states": available_states,
            "available_crop_types": available_crop_types,
            "available_crops": available_crops
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/expected-features")
def get_expected_features():
    """Return the expected feature names and order"""
    expected_features = [
        "State_Name", "Crop_Type", "N", "P", "K", "pH", 
        "rainfall", "temperature", "Area_in_hectares", 
        "Production_in_tons", "Yield_ton_per_hec",
        "NPK_sum", "Production_per_area", "N_by_K", "P_by_K"
    ]
    return {
        "expected_features": expected_features,
        "count": len(expected_features),
        "note": "Features must be provided in this exact order after encoding and scaling"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)