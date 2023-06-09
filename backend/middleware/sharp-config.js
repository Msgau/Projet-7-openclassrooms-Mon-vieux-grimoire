const sharp = require('sharp');
const fs = require('fs');

const convertImageToWebP = (req, res, next) => {
  if (!req.file) {
    // Aucun fichier à convertir
    return next();
  }

  const inputPath = req.file.path; // Chemin d'entrée du fichier
  const outputPath = req.file.path + ".webp"; // Chemin de sortie du fichier

  sharp(inputPath) 
    .webp({ quality: 80 })
    .toFile(outputPath, (err, info) => { 
      if (err) {
        console.error(err);
        fs.unlink(inputPath); // Supprimer le fichier d'entrée en cas d'erreur
        return res.status(500).json({ error: "Erreur lors de la conversion de l'image" });
      }

      req.file.path = outputPath; // Le fichier converti est enregistré dans outputPath

      // Supprimer le fichier d'entrée après la conversion
      fs.unlink(inputPath, (err) => {
        if (err) {
          console.error(err);
        }
        next();
      });
    });
};

module.exports = convertImageToWebP;
