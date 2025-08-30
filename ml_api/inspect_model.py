# ml_api/inspect_model.py
import os, pickle, pprint
MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_model.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

print("Model type:", type(model))
# Common attrs
for attr in ("n_features_in_", "feature_names_in__", "feature_names_in", "named_steps", "steps"):
    if hasattr(model, attr):
        print(f"--- {attr} ---")
        try:
            print(getattr(model, attr))
        except Exception as e:
            print("Could not print", attr, ":", e)

# If it's a pipeline, show nested steps & their expected features if possible
try:
    from sklearn.pipeline import Pipeline
    if isinstance(model, Pipeline):
        print("\nPipeline steps:")
        for name, step in model.steps:
            print(" STEP:", name, type(step))
            if hasattr(step, "get_feature_names_out"):
                try:
                    print("  feature names out (sample):", getattr(step, "get_feature_names_out")()[:10])
                except Exception as e:
                    print("  get_feature_names_out() error:", e)
except Exception:
    pass

# Try to print .get_params() keys (trimmed)
try:
    params = model.get_params()
    print("\nModel params keys (sample):", list(params.keys())[:20])
except Exception as e:
    print("Could not read get_params():", e)
