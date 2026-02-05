const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;
const { sql, poolPromise } = require('./db');

const { getSasUrl } = require('./blobService');
const axios = require("axios");

// TEST ROUTE (VERY IMPORTANT)
app.get('/test', (req, res) => {
  res.send('API working');
});


// Static files LAST
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/users', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query('SELECT id, name, email FROM users');

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.get('/api/image-url', async (req, res) => {
  try {
    const url = await getSasUrl(
      'app-anmol-media',
      'app-anmol-media-public/azure-devops-logo.png'
    );
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate image URL' });
  }
});

app.get("/api/trigger-function", async (req, res) => {
  try {
    // https://fa-app-anmol-dev-dvg2cuaub9dzaugz.centralindia-01.azurewebsites.net/api/orderprocessanmoltriggerdifferent
    // https://fa-app-anmol-dev-dvg2cuaub9dzaugz.centralindia-01.azurewebsites.net/api/orderprocessanmoltriggerdifferent
    // "https://fa-app-anmol-dev.azurewebsites.net/api/orderprocessanmoltriggerdifferent";

    const functionUrl =
      "https://fa-app-anmol-dev-dvg2cuaub9dzaugz.centralindia-01.azurewebsites.net/api/orderprocessanmoltriggerdifferent";

    const response = await axios.get(functionUrl, {
      params: { name: "Anmol" }
    });

    res.json({
      success: true,
      message: response.data
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to trigger Azure Function" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

