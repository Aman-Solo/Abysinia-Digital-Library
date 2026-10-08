const sharp = require("sharp");
const path = require("path");

const convertToWebp = async (filePath, fileName) => {
  const newName = fileName.split(".")[0] + ".webp";
  const newPath = path.join("uploads/optimized", newName);

  await sharp(filePath)
    .resize(1200)
    .toFormat("webp", { quality: 75 })
    .toFile(newPath);

  return newPath;
};

module.exports = { convertToWebp };
