# ml_api/inspect_features.py
import os, pickle, pprint
MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_model.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

print("Model type:", type(model))
print("n_features_in_:", getattr(model, "n_features_in_", None))
print("feature_names_in_:", getattr(model, "feature_names_in_", None))

# Try to get booster feature names (XGBoost)
try:
    booster = model.get_booster()
    fnames = list(booster.feature_names) if booster.feature_names is not None else None
    print("\nbooster.feature_names (len={}):".format(len(fnames) if fnames else 0))
    pprint.pprint(fnames)
except Exception as e:
    print("\nCould not read booster.feature_names:", e)
    fnames = getattr(model, "feature_names_in_", None)

# Compare with the 7 frontend fields you currently send
frontend_fields = ["nitrogen","phosphorus","potassium","temperature","humidity","ph","rainfall"]
print("\nfrontend fields (7):", frontend_fields)

if fnames:
    missing = [f for f in fnames if f not in frontend_fields]
    extra = [f for f in frontend_fields if f not in fnames]
    print("\nMissing fields (expected by model but NOT sent by frontend):")
    pprint.pprint(missing)
    print("\nFrontend-only fields (not found in model feature names):")
    pprint.pprint(extra)
else:
    print("\nNo feature names available from model to compare.")
