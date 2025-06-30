const fs = require('fs');
const path = require('path');

/**
 * Retrieve image files from a specified folder path.
 */
exports.getImageFiles = (folderPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const imageFiles = files.filter((file) => {
          const filePath = path.join(folderPath, file);
          const fileStats = fs.statSync(filePath);
          return fileStats.isFile() && isImageFile(filePath);
        });
        resolve(imageFiles);
      }
    });
  });
};
/**
 *  Check if a file is an image file based on its extension.
 */
function isImageFile(filePath) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(filePath);
  return imageExtensions.includes(ext.toLowerCase());
}
