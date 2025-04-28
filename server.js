const express = require('express');
const path = require('path');
const app = express();

// Servir los archivos estáticos del dist/
app.use(express.static(path.join(__dirname, 'dist/crc-ecommerce')));

// Redirigir todas las peticiones a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/crc-ecommerce/index.html'));
});

// Puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
