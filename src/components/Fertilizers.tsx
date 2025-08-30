import { useState } from "react";

type FertilizerFormData = {
  crop: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  area_in_hectares: string;
};

type FertilizerItem = {
  name: string;
  amount_kg_per_hectare: number;
  stage: string;
};

type FertilizerResult = {
  fertilizer_recommendation: FertilizerItem[];
};

const CROPS = [
  "cotton",
  "horsegram",
  "jowar",
  "maize",
  "moong",
  "ragi",
  "rice",
  "sunflower",
  "wheat",
  "sesamum",
  "soyabean",
  "rapeseed",
  "jute",
  "arecanut",
  "onion",
  "potato",
  "sweetpotato",
  "tapioca",
  "turmeric",
  "barley",
  "banana",
  "coriander",
  "garlic",
  "blackpepper",
  "cardamom",
  "cashewnuts",
  "blackgram",
  "coffee",
  "ladyfinger",
  "brinjal",
  "cucumber",
  "grapes",
  "mango",
  "orange",
  "papaya",
  "tomato",
  "cabbage",
  "bottlegourd",
  "pineapple",
  "carrot",
  "radish",
  "bittergourd",
  "drumstick",
  "jackfruit",
  "cauliflower",
  "watermelon",
  "ashgourd",
  "beetroot",
  "pomegranate",
  "ridgegourd",
  "pumpkin",
  "apple",
  "ginger",
];

export default function FertilizerRecommend() {
  const [formData, setFormData] = useState<FertilizerFormData>({
    crop: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    area_in_hectares: "1",
  });

  const [result, setResult] = useState<FertilizerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      if (!formData.crop) {
        throw new Error("Please select a crop");
      }

      const payload = {
        crop: formData.crop,
        actual_N: parseFloat(formData.nitrogen),
        actual_P: parseFloat(formData.phosphorus),
        actual_K: parseFloat(formData.potassium),
      };

      console.log("Sending payload:", payload);

      const res = await fetch(
        "http://localhost:9000/api/fertilizer/recommend",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          `API error: ${res.status} ${res.statusText}${
            errorData ? ` - ${errorData.details || errorData.error}` : ""
          }`
        );
      }

      const data: FertilizerResult = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Fertilizer error:", error);
      setError((error as Error).message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = () => {
    setFormData({
      crop: "rice",
      nitrogen: "80",
      phosphorus: "40",
      potassium: "30",
      area_in_hectares: "2",
    });
  };

  return (
    <div className="p-4 overflow-auto max-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🌿 Fertilizer Recommendation</h2>
        <button
          type="button"
          onClick={fillSampleData}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Fill Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3">
        {/* Crop Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Crop *</label>
          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Crop</option>
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* NPK Inputs */}
        {[
          ["nitrogen", "Nitrogen (N)", "kg/ha"],
          ["phosphorus", "Phosphorus (P)", "kg/ha"],
          ["potassium", "Potassium (K)", "kg/ha"],
          ["area_in_hectares", "Area", "hectares"],
        ].map(([key, label, unit]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">
              {label} ({unit}) *
            </label>
            <input
              type="number"
              step="any"
              name={key}
              value={formData[key as keyof FertilizerFormData]}
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
          {loading ? "🔄 Checking..." : "💧 Recommend Fertilizer"}
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
      {result && result.fertilizer_recommendation.length > 0 && !error && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-lg font-semibold mb-2">🌱 Fertilizer Advice:</p>
          <ul className="list-disc list-inside space-y-2">
            {result.fertilizer_recommendation.map((item, idx) => (
              <li key={idx}>
                <strong>{item.name}</strong>: {item.amount_kg_per_hectare} kg/ha
                — <em>{item.stage}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
