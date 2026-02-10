const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const response = await axios.get(
      'https://generativelanguage.googleapis.com/v1beta/models',
      {
        params: { key: apiKey },
        timeout: 15000
      }
    );

    const models = Array.isArray(response.data?.models) ? response.data.models : [];
    const simplified = models.map((model) => ({
      name: model.name,
      displayName: model.displayName,
      supportedGenerationMethods: model.supportedGenerationMethods
    }));

    return res.json({ models: simplified });
  } catch (err) {
    const message = err.response?.data?.error?.message || err.message;
    return res.status(500).json({ error: 'Failed to list models', message });
  }
});

module.exports = router;
