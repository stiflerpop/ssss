const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/proxy-to-openai', async (req, res) => {
  try {
    const { method, path, data } = req.body;
    const url = `https://api.openai.com/v1${path}`;
    
    const response = await axios({
      method,
      url,
      data,
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});