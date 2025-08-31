import { useState } from "react";

type FormData = {
  state_name: string;
  crop_type: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  pH: string;
  rainfall: string;
  temperature: string;
  area_in_hectares: string;
  production_in_tons: string;
  yield_ton_per_hec: string;
};

const STATES = [
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttar pradesh",
  "uttarakhand",
  "west bengal",
];
const CROP_TYPES = ["kharif", "rabi", "zaid", "summer", "winter", "whole year"];

// Only numeric fields for number validation
const numericFields = [
  "nitrogen",
  "phosphorus",
  "potassium",
  "pH",
  "rainfall",
  "temperature",
  "area_in_hectares",
  "production_in_tons",
  "yield_ton_per_hec",
];

const ranges: { [key: string]: [number, number] } = {
  nitrogen: [0, 140],
  phosphorus: [5, 145],
  potassium: [5, 205],
  pH: [0, 14],
  rainfall: [0, 300],
  temperature: [0, 50],
  area_in_hectares: [0.1, 100000],
  production_in_tons: [0.1, 1000000],
  yield_ton_per_hec: [0.01, 100],
};

export default function TestPredict() {
  const [formData, setFormData] = useState<FormData>({
    state_name: "",
    crop_type: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    pH: "",
    rainfall: "",
    temperature: "",
    area_in_hectares: "",
    production_in_tons: "",
    yield_ton_per_hec: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only validate number/range for numeric fields, string required for dropdowns
  const validateField = (name: string, value: string) => {
    if (value.trim() === "") return "This field is required";
    if (numericFields.includes(name)) {
      const num = Number(value);
      if (isNaN(num)) return "Must be a number";
      if (ranges[name]) {
        const [min, max] = ranges[name];
        if (num < min || num > max) return `Must be between ${min} and ${max}`;
      }
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate this field
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    setError(null); // clear API error on change
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation for all fields
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const msg = validateField(key, formData[key as keyof FormData]);
      if (msg) newErrors[key] = msg;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // stop submit

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload = {
        state_name: formData.state_name,
        crop_type: formData.crop_type,
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        pH: parseFloat(formData.pH),
        rainfall: parseFloat(formData.rainfall),
        temperature: parseFloat(formData.temperature),
        area_in_hectares: parseFloat(formData.area_in_hectares),
        production_in_tons: parseFloat(formData.production_in_tons),
        yield_ton_per_hec: parseFloat(formData.yield_ton_per_hec),
      };

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          `API error: ${res.status} ${res.statusText}${
            errorData ? ` - ${errorData.details || errorData.error}` : ""
          }`
        );
      }

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.details || data.error || "Prediction failed");
      }

      setResult(data.prediction || "No prediction returned");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Button enabled when all fields valid and filled in
  const isFormValid =
    Object.values(errors).every((err) => err === "") &&
    Object.values(formData).every((val) => val.trim() !== "");

  return (
    <div className="p-4 overflow-auto max-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🌱 Crop Predictor</h2>
        <button
          type="button"
          onClick={() =>
            setFormData({
              state_name: "andhra pradesh",
              crop_type: "kharif",
              nitrogen: "120",
              phosphorus: "40",
              potassium: "20",
              pH: "5.46",
              rainfall: "200",
              temperature: "29.27",
              area_in_hectares: "100",
              production_in_tons: "500",
              yield_ton_per_hec: "5",
            })
          }
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Fill Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">State Name *</label>
          <select
            name="state_name"
            value={formData.state_name}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select State</option>
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </option>
            ))}
          </select>
          {errors.state_name && (
            <p className="text-red-500 text-sm mt-1">{errors.state_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Crop Type *</label>
          <select
            name="crop_type"
            value={formData.crop_type}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Crop Type</option>
            {CROP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          {errors.crop_type && (
            <p className="text-red-500 text-sm mt-1">{errors.crop_type}</p>
          )}
        </div>

        {[
          ["nitrogen", "Nitrogen (N)", "kg/ha"],
          ["phosphorus", "Phosphorus (P)", "kg/ha"],
          ["potassium", "Potassium (K)", "kg/ha"],
          ["pH", "Soil pH", "0-14"],
          ["rainfall", "Rainfall", "mm"],
          ["temperature", "Temperature", "°C"],
          ["area_in_hectares", "Area", "hectares"],
          ["production_in_tons", "Production", "tons"],
          ["yield_ton_per_hec", "Yield", "tons/hectare"],
        ].map(([key, label, unit]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">
              {label} ({unit}) *
            </label>
            <input
              type="number"
              step="any"
              name={key}
              value={formData[key as keyof FormData]}
              onChange={handleChange}
              placeholder={`Enter ${label.toLowerCase()}`}
              className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${
                errors[key as string]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              required
              min={ranges[key]?.[0]}
              max={ranges[key]?.[1]}
            />
            {errors[key as string] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[key as string]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`px-4 py-2 rounded text-white mt-4 transition-colors ${
            isFormValid && !loading
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "🔄 Predicting..." : "🚀 Predict Crop"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">
            ❌ <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}
      {result && !error && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-lg">
            🌱 <span className="font-semibold">Recommended Crop:</span>{" "}
            <span className="text-2xl font-bold text-green-700 capitalize">
              {result}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
