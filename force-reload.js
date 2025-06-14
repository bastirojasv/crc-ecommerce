// force-reload.js
const fs = require('fs');
const path = './src/app/app.component.ts';

fs.readFile(path, 'utf8', (err, data) => {
  if (err) throw err;

  const marker = '// 🔄 reload-marker';
  let updated = '';

  if (data.includes(marker)) {
    // Reemplaza la línea existente con una nueva marca (para cambiar el hash del archivo)
    updated = data.replace(new RegExp(`${marker}.*`), `${marker} ${Date.now()}`);
  } else {
    // Si no existe, agrega la marca al final
    updated = data + `\n${marker} ${Date.now()}`;
  }

  fs.writeFile(path, updated, 'utf8', (err) => {
    if (err) throw err;
    console.log('✅ Reload trigger actualizado');
  });
});
