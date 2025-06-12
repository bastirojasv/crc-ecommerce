import os
import json
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Parámetros configurables
directorio = "C:\\Users\\basti\\Documents\\WebPage Fernando\\crc-ecommerce\\src\\assets\\images"
resolucion_minima = (300, 300)  # ancho, alto mínimos aceptables
salida_json = "imagenes_baja_resolucion.json"

# Función para verificar resolución
def es_baja_resolucion(imagen_path, resolucion_minima):
    try:
        with Image.open(imagen_path) as img:
            img.verify()  # Verifica que sea una imagen válida
        with Image.open(imagen_path) as img:  # Reabrir para obtener tamaño
            width, height = img.size
            return width < resolucion_minima[0] or height < resolucion_minima[1], (width, height)
    except Exception as e:
        print(f"❌ Error al abrir {imagen_path}: {e}")
        return False, (0, 0)

# Buscar imágenes en el directorio
imagenes_baja_resolucion = []

for root, dirs, files in os.walk(directorio):
    for archivo in files:
        if archivo.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif")):
            ruta_imagen = os.path.join(root, archivo)
            es_baja, size = es_baja_resolucion(ruta_imagen, resolucion_minima)
            if es_baja:
                imagenes_baja_resolucion.append({
                    "ruta": ruta_imagen,
                    "ancho": size[0],
                    "alto": size[1]
                })

# Guardar resultados en JSON
with open(salida_json, "w", encoding="utf-8") as f:
    json.dump(imagenes_baja_resolucion, f, indent=4, ensure_ascii=False)

print(f"\n🟡 {len(imagenes_baja_resolucion)} imágenes de baja resolución guardadas en '{salida_json}'")
