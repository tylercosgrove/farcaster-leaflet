// pages/api/imageProxy.js
import axios from "axios";

export default async function handler(req, res) {
  const imageUrl = req.query.src;

  if (!imageUrl) {
    return res.status(400).json({ error: "src parameter is required" });
  }

  try {
    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/png");
    res.send(imageRes.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
