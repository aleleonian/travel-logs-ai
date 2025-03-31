import fs from 'fs';
import path from 'path';

const logsRoot = './logs'; // <-- Update if needed
const outputPath = './entries.json';

function isTextFile(filename) {
  return filename.endsWith('.txt');
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function walkLogs(rootFolder) {
  const entries = [];

  const years = fs.readdirSync(rootFolder);
  for (const year of years) {
    const yearPath = path.join(rootFolder, year);
    if (!fs.statSync(yearPath).isDirectory()) continue;

    const countries = fs.readdirSync(yearPath);
    for (const country of countries) {
      const countryPath = path.join(yearPath, country);
      if (!fs.statSync(countryPath).isDirectory()) continue;

      const months = fs.readdirSync(countryPath);
      for (const month of months) {
        const monthPath = path.join(countryPath, month);
        if (!fs.statSync(monthPath).isDirectory()) continue;

        const days = fs.readdirSync(monthPath);
        for (const dayFile of days) {
          if (!isTextFile(dayFile)) continue;

          const dayNum = dayFile.replace('.txt', '');
          const date = `${year}-${pad(month)}-${pad(dayNum)}`;
          const filePath = path.join(monthPath, dayFile);
          const rawText = fs.readFileSync(filePath, 'utf8');

          entries.push({
            date,
            country,
            text: rawText.trim(),
            filepath: path.relative('.', filePath),
          });
        }
      }
    }
  }

  return entries;
}

// 👇 Run it
const data = walkLogs(logsRoot);
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Exported ${data.length} entries to ${outputPath}`);
