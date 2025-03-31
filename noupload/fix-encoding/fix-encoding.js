import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';

/**
 * Recursively traverse a directory and return all .txt file paths
 */
function getAllTextFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getAllTextFiles(fullPath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.txt') {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Convert a Windows-1252 encoded file to UTF-8
 */
function convertToUtf8(filePath) {
  const buffer = fs.readFileSync(filePath);
  const decoded = iconv.decode(buffer, 'windows-1252');
  fs.writeFileSync(filePath, decoded, 'utf8');
  console.log(`✅ Converted: ${filePath}`);
}

// 🔁 MAIN LOGIC
const rootFolder = './logs'; // <-- replace with your top-level folder

const txtFiles = getAllTextFiles(rootFolder);
txtFiles.forEach(convertToUtf8);
