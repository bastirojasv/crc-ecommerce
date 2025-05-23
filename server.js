const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// Servir Angular desde /dist/crc-ecommerce/browser
app.use(express.static(path.join(__dirname, 'dist/crc-ecommerce/browser')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/crc-ecommerce/browser', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
