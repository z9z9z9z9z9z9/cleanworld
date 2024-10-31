import fetch from "node-fetch";  // Import fetch to use with Vercel

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const imageBuffer = req.body;
  const apiUrl = "https://api.facedetection.com/v3/detect";  // Example API endpoint
  
  try {
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": `Bearer ${process.env.API_KEY}`,  // Secure API Key
      },
      body: imageBuffer,
    });

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API call error:", error);
    res.status(500).send("API call failed");
  }
};
