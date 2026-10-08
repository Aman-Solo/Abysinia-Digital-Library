const { exec } = require("child_process");
const path = require("path");

const convertToWebm = (filePath, fileName) => {
  const baseName = fileName.split(".")[0];
  const outputPath = path.join("uploads/optimized", baseName + ".webm");

  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${filePath}" -c:v libvpx -b:v 1M -c:a libvorbis "${outputPath}"`;

    exec(command, (error) => {
      if (error) reject(error);
      else resolve(outputPath);
    });
  });
};

module.exports = { convertToWebm };
