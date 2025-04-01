// File: server.js
import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'text-embedding-3-small';
let entries = [];

app.post('/query', async (req, res) => {
  const { question } = req.body;

  // 1. Embed the user's question
  const questionEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question
  });

  const queryVector = questionEmbedding.data[0].embedding;

  // 2. Compute similarity to all travel log vectors (same as before)
  const topEntries = computeTopKSimilar(queryVector, entries, 8);

  // 3. Build prompt for GPT
  const prompt = `
Eres un asistente que responde preguntas sobre los diarios personales de un viajero.

Aquí hay fragmentos de su diario:

${topEntries.map(entry => `📅 ${entry.date}\n${entry.text}`).join('\n\n')}

Pregunta: ${question}
`;

  // 4. Ask GPT-4
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Responde con precisión y concisión. Si no hay información suficiente, dilo.' },
      { role: 'user', content: prompt }
    ]
  });

  const answer = response.choices[0].message.content;

  res.json({ answer, entries: topEntries }); // optionally include entries
});


function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB);
}

function computeTopKSimilar(queryVector, allEntries, k = 5) {
  const scored = allEntries.map(entry => ({
    ...entry,
    score: cosineSimilarity(queryVector, entry.embedding)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

async function loadEmbeddings() {
  const raw = await fs.readFile('./entries-with-embeddings.json', 'utf-8');
  entries = JSON.parse(raw);
  console.log(`✅ Loaded ${entries.length} embedded entries.`);
}

app.listen(port, async () => {
  await loadEmbeddings();
  console.log(`🚀 Server running at http://localhost:${port}`);
});
