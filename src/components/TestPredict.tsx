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

// Available options for dropdowns
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

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Validate required fields
      if (!formData.state_name || !formData.crop_type) {
        throw new Error("Please select both state name and crop type");
      }

      const payload = {
        state_name: formData.state_name, // Keep as string
        crop_type: formData.crop_type, // Keep as string
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

      console.log("Sending payload:", payload);

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
    } catch (error) {
      console.error("Prediction error:", error);
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for quick testing
  const fillSampleData = () => {
    setFormData({
      state_name: "andhra pradesh",
      crop_type: "kharif",
      nitrogen: "120",
      phosphorus: "40",
      potassium: "20",
      pH: "5.46",
      rainfall: "654.34",
      temperature: "29.27",
      area_in_hectares: "7300",
      production_in_tons: "9400",
      yield_ton_per_hec: "1.29",
    });
  };

  return (
    <div className="p-4 overflow-auto max-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🌱 Crop Predictor</h2>
        <button
          type="button"
          onClick={fillSampleData}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Fill Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3">
        {/* State Name Dropdown */}
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
        </div>

        {/* Crop Type Dropdown */}
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
        </div>

        {/* Numerical Input Fields */}
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
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors mt-4"
        >
          {loading ? "🔄 Predicting..." : "🚀 Predict Crop"}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">
            ❌ <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Success Result */}
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

      {/* API Instructions */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <h3 className="font-semibold mb-2">📝 Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Select your state and crop type from the dropdowns</li>
          <li>Fill in all the numerical fields with appropriate values</li>
          <li>Click "Fill Sample Data" to test with example values</li>
          <li>
            The API will return the most suitable crop for your conditions
          </li>
        </ul>
      </div>
    </div>
  );
}
