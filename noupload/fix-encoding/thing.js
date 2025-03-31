import fs from 'fs';

const input = fs.readFileSync('./latin1.txt', 'utf8');

if (input.includes('ï¿½')) {
  console.log('🧪 This file contains mojibake (like ï¿½) — might be reversible.');
} else if (input.includes('?')) {
  console.log('❌ This file contains literal ? — the original characters are already lost.');
} else {
  console.log('✅ File looks clean.');
}
