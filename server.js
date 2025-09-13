import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the build/dist folder
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback: serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server on Render's PORT or 10000 locally
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});

