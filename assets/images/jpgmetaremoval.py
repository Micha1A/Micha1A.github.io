import os
from PIL import Image

def nuke_metadata():
    # Aktuelles Verzeichnis greifen
    directory = os.getcwd()
    print(f"Starte Metadaten-Reset in: {directory}")

    processed_count = 0

    for filename in os.listdir(directory):
        # Greift nur JPEGs auf, ignoriert das Python-Skript selbst
        if filename.lower().endswith(('.jpg', '.jpeg')):
            file_path = os.path.join(directory, filename)
            try:
                with Image.open(file_path) as img:
                    # Zero-Allocation: Frisches Canvas im Speicher erzeugen
                    clean_image = Image.new(img.mode, img.size)
                    # Rohe Pixel kopieren, alte Metadaten (EXIF etc.) fallen weg
                    clean_image.paste(img)
                    
                    # Originaldatei knallhart überschreiben, Qualität bei 100% halten
                    clean_image.save(file_path, "JPEG", quality=100)
                    
                print(f"[OK] Metadaten vernichtet: {filename}")
                processed_count += 1
            except Exception as e:
                print(f"[ERROR] Fehler bei {filename}: {e}")

    print(f"Fertig. {processed_count} JPEGs sind komplett clean.")

if __name__ == "__main__":
    nuke_metadata()