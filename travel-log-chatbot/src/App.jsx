import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    const res = await fetch('http://localhost:3001/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  debugger;

  return (
    <div className="app">
      <h1>🧳 Travel Log Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask something about your trips..."
        />
        <button type="submit">Ask</button>
      </form>
      {loading && <p>Loading...</p>}
      <div className="results">
        {/* {results.map((entry, idx) => (
          <div key={idx} className="entry">
            <h3>{entry.date} — {entry.country}</h3>
            <p>{entry.text}</p>
            <small>Similarity: {entry.similarity.toFixed(3)}</small>
          </div>
        ))} */}
        {
          results.answer &&
          <textarea cols="100" rows="10">{results.answer}</textarea>
        }
      </div>
    </div >
  );
}