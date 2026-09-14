const fs = require("node:fs");
const path = require("node:path");

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token || token !== process.env.SCRIPT_TOKEN) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {
    const filePath = path.join(process.cwd(), "script.lua");
    const script = fs.readFileSync(filePath, "utf8");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.status(200).send(script);
  } catch {
    return res.status(500).json({
      error: "Script unavailable"
    });
  }
};
