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
    let res;
    try {
      res = await fetch('http://localhost:3001/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
    }
    catch (error) {
      const data = {};
      data.answer = error;
      setResults(data);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

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
        {
          results.answer &&
          <textarea
            style={{ width: '100%', height: '300px' }}
            value={results.answer}
            onChange={(e) => setText(e.target.value)}
          />}
      </div>
    </div >
  );
}