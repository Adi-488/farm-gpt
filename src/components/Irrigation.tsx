import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

// Define expected API response shape
type IrrigationResult = {
  crop: string;
  recommended_irrigation: string;
  total_liters_for_area: number;
  frequency: string;
  note: string;
};

function IrrigationApp() {
  const [crop, setCrop] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [rainfall, setRainfall] = useState<string>("");
  const [area, setArea] = useState<string>("1.0");

  const [result, setResult] = useState<IrrigationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);

    // Parse inputs to numbers for validation and API call
    const tempNum = parseFloat(temperature);
    const humidityNum = parseFloat(humidity);
    const rainfallNum = parseFloat(rainfall);
    const areaNum = parseFloat(area);

    // Basic input validation
    if (
      !crop ||
      isNaN(tempNum) ||
      isNaN(humidityNum) ||
      isNaN(rainfallNum) ||
      isNaN(areaNum)
    ) {
      setError("Please provide valid values for all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8001/ml_irrigation/irrigation/recommend",
        {
          crop,
          temperature: tempNum,
          humidity: humidityNum,
          rainfall: rainfallNum,
          area_hectares: areaNum,
        }
      );
      setResult(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
            "An error occurred while fetching the recommendation."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "auto",
        padding: "1rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Irrigation Recommendation</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <label>
          Crop:
          <input
            type="text"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Enter crop name"
            required
          />
        </label>

        <label>
          Temperature (°C):
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g., 30"
            step="0.1"
            required
          />
        </label>

        <label>
          Humidity (%):
          <input
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            placeholder="e.g., 60"
            step="0.1"
            required
          />
        </label>

        <label>
          Rainfall (mm):
          <input
            type="number"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            placeholder="e.g., 0"
            step="0.1"
            required
          />
        </label>

        <label>
          Area (hectares):
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            step="0.1"
            min="0.1"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.6rem", fontWeight: "bold" }}
        >
          {loading ? "Calculating..." : "Get Recommendation"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: 16,
            backgroundColor: "#f6f6f6",
            padding: 16,
            borderRadius: 4,
          }}
        >
          <h2>Result for {result.crop}</h2>
          <p>
            <strong>{result.recommended_irrigation}</strong>
          </p>
          <p>
            Total liters for area:{" "}
            {result.total_liters_for_area.toLocaleString()}
          </p>
          <p>Frequency: {result.frequency}</p>
          <p>
            <em>{result.note}</em>
          </p>
        </div>
      )}
    </div>
  );
}

export default IrrigationApp;
