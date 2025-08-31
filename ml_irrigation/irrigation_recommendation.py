import csv

def _climate_factor(temperature, humidity):
    # Neutral: 25°C and 60% humidity
    factor = 1 + 0.02 * (temperature - 25) - 0.005 * (humidity - 60)
    return max(0.8, min(1.2, factor))  # clamp between 0.8 and 1.2

def _load_crop_data(path):
    crop_data = {}
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            crop_data[row["crop"].strip().lower()] = float(row["base_mm_per_day"])
    return crop_data

class IrrigationScheduler:
    def __init__(self):
        self.crop_data = _load_crop_data("D:\\Intellify Hackathon\\AquaSense Datasets\\crop_water_req.csv")


    def recommend(self, crop, temperature, humidity, rainfall, area_hectares=1.0):
        crop_key = crop.lower()
        if crop_key not in self.crop_data:
            return {"error": f"No data for crop '{crop}'"}

        base_mm = self.crop_data[crop_key]
        climate_adj = _climate_factor(temperature, humidity)

        # No soil adjustment
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
            "note": "Irrigation need adjusts automatically with rainfall and weather."
        }


