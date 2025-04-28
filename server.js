const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos del build de Angular
app.use(express.static(path.join(__dirname, 'dist/crc-ecommerce')));

// Cualquier otra ruta debe devolver index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/crc-ecommerce/index.html'));
});

// Escuchar el puerto que asigna Heroku o localmente en 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
