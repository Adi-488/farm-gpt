const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000; // Main Node.js server port

app.use(cors());
app.use(express.json());

// Example API route (for testing Node server)
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js backend!" });
});

// Route to forward request to FastAPI ML server
app.post("/api/predict", async (req, res) => {
  try {
    console.log("Received prediction request:", req.body);

    const { data } = await axios.post(
      "http://localhost:8000/predict",
      req.body
    );

    console.log("FastAPI response:", data);
    res.json(data);
  } catch (err) {
    console.error("Error calling ML API:", err.message);
    res
      .status(502)
      .json({ error: "ML API not responding", details: err.message });
  }
});

// Add a new route for fertilizer recommendation
app.post("/api/fertilizer/recommend", async (req, res) => {
  try {
    const { data } = await axios.post(
      "http://localhost:9000/api/fertilizer/recommend",
      req.body
    );
    res.json(data);
  } catch (err) {
    console.error("Error calling Fertilizer API:", err.message);
    res.status(502).json({ error: "Fertilizer API not responding" });
  }
});

// NEW: Route for irrigation recommendation
app.post("/api/irrigation/recommend", async (req, res) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/irrigation/recommend", // <--- irrigation port
      req.body
    );
    res.json(data);
  } catch (err) {
    console.error("Error calling Irrigation API:", err.message);
    res.status(502).json({ error: "Irrigation API not responding" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
});
