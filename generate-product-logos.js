const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, 'src/assets/images/product_logos');
const outputDir = path.join(__dirname, 'src/assets/data/product_logos');
const outputFile = path.join(outputDir, 'product-logos.ts');

const files = fs.readdirSync(logosDir)
  .filter(file => file.endsWith('.png'));

// CREA LA CARPETA SI NO EXISTE
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const content = `// Archivo generado automáticamente
export const PRODUCT_LOGOS: string[] = [
${files.map(f => `  '${f}'`).join(',\n')}
];
`;

fs.writeFileSync(outputFile, content);
console.log('Archivo product-logos.ts generado con', files.length, 'logos.');