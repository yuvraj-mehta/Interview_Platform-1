// import express from "express";

// const router = express.Router();

// router.post("/execute", async (req, res) => {
//   try {
//     const { language, version, code } = req.body;

//     const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         language,
//         version,
//         files: [
//           {
//             content: code,
//           },
//         ],
//       }),
//     });

//     const data = await response.json();
//     res.json(data);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Judge0 public endpoint (no API key required for many instances)
const JUDGE0_URL =
  "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

/**
 * POST /api/code/execute
 * Body: { language, code }
 */
router.post("/execute", async (req, res) => {
  try {
    const { language, code } = req.body;

    // Judge0 language IDs (common ones)
    const languageMap = {
      javascript: 63, // Node.js
      python: 71,     // Python 3
      java: 62        // Java (OpenJDK 15)
    };

    const language_id = languageMap[language.toLowerCase()];
    if (!language_id) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const body = {
      source_code: code,
      language_id,
    };

    const response = await fetch(JUDGE0_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Judge0 execution error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;