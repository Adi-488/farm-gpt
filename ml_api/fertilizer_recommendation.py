import pandas as pd

# Load fertilizer content % table
fertilizer_content = {
    'Urea': {'N': 46, 'P': 0, 'K': 0},
    'DAP': {'N': 18, 'P': 46, 'K': 0},
    'MOP': {'N': 0, 'P': 0, 'K': 60}
}

def recommend_fertilizer(crop, actual_N, actual_P, actual_K):
    # Load crop requirements
    df = pd.read_csv("fertilizer_data.csv")
    crop_data = df[df['Crop'].str.lower() == crop.lower()]
    if crop_data.empty:
        return {"error": f"No data found for crop '{crop}'"}
    
    ideal_N = crop_data.iloc[0]['N']
    ideal_P = crop_data.iloc[0]['P']
    ideal_K = crop_data.iloc[0]['K']
    
    # Calculate nutrient gaps
    short_N = max(0, ideal_N - actual_N)
    short_P = max(0, ideal_P - actual_P)
    short_K = max(0, ideal_K - actual_K)
    
    recommendations = []
    
    # Nitrogen recommendation (Urea or DAP)
    if short_N > 0:
        # Prefer Urea unless P is also low, then use DAP
        if short_P > 0:
            dap_needed = short_P / (fertilizer_content['DAP']['P'] / 100)
            recommendations.append({
                "name": "DAP",
                "amount_kg_per_hectare": round(dap_needed, 2),
                "stage": "Before sowing"
            })
            short_N -= dap_needed * (fertilizer_content['DAP']['N'] / 100)
        
        if short_N > 0:
            urea_needed = short_N / (fertilizer_content['Urea']['N'] / 100)
            recommendations.append({
                "name": "Urea",
                "amount_kg_per_hectare": round(urea_needed, 2),
                "stage": "During early growth stage"
            })
    
    # Potassium recommendation (MOP)
    if short_K > 0:
        mop_needed = short_K / (fertilizer_content['MOP']['K'] / 100)
        recommendations.append({
            "name": "MOP (Potash)",
            "amount_kg_per_hectare": round(mop_needed, 2),
            "stage": "Before flowering"
        })
    
    return {"fertilizer_recommendation": recommendations}
