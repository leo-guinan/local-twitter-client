import React from 'react';
import { Bot, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AGENTS = [
  {
    id: 1,
    name: 'Sentiment Analyzer',
    status: 'running',
    lastTask: 'Analyzing tweet sentiments',
    completedTasks: 145,
  },
  {
    id: 2,
    name: 'Content Curator',
    status: 'idle',
    lastTask: 'Organizing trending topics',
    completedTasks: 89,
  },
];

export function AgentsDashboard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Agents Dashboard</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          <Bot size={18} />
          <span>New Agent</span>
        </button>
      </div>

      <div className="space-y-4">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="text-purple-500" size={24} />
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.lastTask}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {agent.status === 'running' ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <Clock size={16} />
                    Running
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500">
                    <AlertCircle size={16} />
                    Idle
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle size={16} />
              <span>{agent.completedTasks} tasks completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}