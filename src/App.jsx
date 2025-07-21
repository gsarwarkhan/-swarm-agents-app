import SwarmAgent from './components/SwarmAgent';
import mentalHealthPrompt from './agents/mentalHealth.js';
import businessPolicyPrompt from './agents/businessPolicy.js';
import doctorPrompt from './agents/doctor.js';
import engineerPrompt from './agents/engineer.js';
import numerologyPrompt from './agents/numerology.js';

const agents = [
  {
    name: 'Mental Health Coach Swarm',
    promptBuilder: mentalHealthPrompt,
    color: 'bg-blue-100',
  },
  {
    name: 'Business Policy Swarm',
    promptBuilder: businessPolicyPrompt,
    color: 'bg-green-100',
  },
  {
    name: 'Doctor Swarm',
    promptBuilder: doctorPrompt,
    color: 'bg-pink-100',
  },
  {
    name: 'Engineer Swarm',
    promptBuilder: engineerPrompt,
    color: 'bg-yellow-100',
  },
  {
    name: 'Numerology + Spiritual Swarm',
    promptBuilder: numerologyPrompt,
    color: 'bg-purple-100',
  },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      <header className="w-full bg-gradient-to-r from-green-700 via-green-600 to-green-500 shadow-lg mb-10">
        <div className="flex items-center justify-center py-7 gap-3">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">Swarm Agents App</h1>
        </div>
      </header>
      <main className="w-full max-w-7xl px-2 sm:px-6 flex-1 flex flex-col items-center">
        <div className="glass w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 sm:gap-y-16 sm:gap-x-12 p-4 sm:p-8 rounded-3xl fade-in">
          {agents.map(agent => (
            <SwarmAgent
              key={agent.name}
              name={agent.name}
              promptBuilder={agent.promptBuilder}
              cardColor={agent.color}
            />
          ))}
        </div>
      </main>
      <footer className="w-full text-center py-6 text-green-700 font-semibold opacity-80 text-sm mt-10">
        &copy; {new Date().getFullYear()} Swarm Agents. All rights reserved.
      </footer>
    </div>
  );
}
