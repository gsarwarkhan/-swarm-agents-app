import React, { useState } from 'react';

const AGENT_AVATARS = {
  'Mental Health Coach Swarm': '🧠',
  'Business Policy Swarm': '📊',
  'Doctor Swarm': '🩺',
  'Engineer Swarm': '🛠️',
  'Numerology + Spiritual Swarm': '🔮',
};

const MODELS = [
  { value: 'gemini-pro', label: 'Gemini Pro (Text)' },
  { value: 'gemini-pro-vision', label: 'Gemini Pro Vision (Multimodal)' },
  { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro' },
  { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash' },
  { value: 'gemma-3-4b-it', label: 'Gemma 3 4B IT' },
  { value: 'gemma-3-1b-it', label: 'Gemma 3 1B IT' },
];

export default function SwarmAgent({ name, promptBuilder, cardColor }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState(MODELS[0].value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const prompt = promptBuilder(input);
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setOutput(data.candidates[0].content.parts[0].text);
      } else {
        setError('No response from Gemini API.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass card-hover fade-in rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col min-h-[410px] max-w-xl mx-auto transition-all duration-300 mt-4 sm:mt-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-2xl shadow font-sans">
          {AGENT_AVATARS[name] || '🤖'}
        </div>
        <h2 className="text-2xl font-bold text-green-700 font-poppins drop-shadow-sm">{name}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-2">
        <select
          className="border border-green-100 rounded px-3 py-2 mb-2 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 font-sans"
          value={model}
          onChange={e => setModel(e.target.value)}
        >
          {MODELS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <input
          className="border border-green-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-green-50 font-sans"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={name === 'Mental Health Coach Swarm' ? 'What can you do?' : `Ask the ${name}...`}
          required
        />
        <button
          className="btn-gradient text-white px-4 py-2 rounded font-semibold shadow btn-press hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 font-sans"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2"><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-green-300 rounded-full"></span>Thinking...</span>
          ) : 'Ask'}
        </button>
      </form>
      {loading && <div className="mt-2 text-sm text-green-500">Loading...</div>}
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      {output && (
        <div className="mt-4 p-4 bg-green-50/80 border border-green-100 rounded-xl text-gray-800 whitespace-pre-line shadow-inner fade-in font-sans">
          {output}
        </div>
      )}
    </div>
  );
} 