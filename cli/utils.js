const fs = require("fs");
const path = require("path");

/**
 * Ensures a directory exists, creating it recursively if it doesn't
 * @param {string} dirPath - The directory path to ensure exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

/**
 * Safely writes a file, ensuring the directory exists first
 * @param {string} filePath - The full path to the file to write
 * @param {string} content - The content to write to the file
 */
function safeWriteFile(filePath, content) {
  const dir = path.dirname(filePath);
  ensureDirectoryExists(dir);
  fs.writeFileSync(filePath, content);
}

module.exports = {
  ensureDirectoryExists,
  safeWriteFile
};
