// embed-logs.js
import fs from 'fs/promises';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ENTRIES_PATH = './entries.json';
const OUTPUT_PATH = './entries-with-embeddings.json';
const MODEL = 'text-embedding-3-small';

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

async function main() {
  const file = await fs.readFile(ENTRIES_PATH, 'utf-8');
  const entries = JSON.parse(file);
  const result = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    try {
      const embedding = await getEmbedding(entry.text);
      result.push({ ...entry, embedding });
      console.log(`✅ Embedded ${i + 1}/${entries.length}: ${entry.date}`);
    } catch (err) {
      console.error(`❌ Error embedding entry on ${entry.date}`, err.message);
    }
    await new Promise(r => setTimeout(r, 200)); // to avoid rate limits
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\n✅ All done! Saved to ${OUTPUT_PATH}`);
}

main();
