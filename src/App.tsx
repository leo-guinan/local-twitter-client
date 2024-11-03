import React, { useState } from 'react';
import { Layout, MessageSquare, Share2, Bot } from 'lucide-react';
import { TweetInput } from './components/TweetInput';
import { Feed } from './components/Feed';
import { GraphCanvas } from './components/GraphCanvas';
import { AgentsDashboard } from './components/AgentsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Layout className="h-8 w-8 text-blue-500" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'feed'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <MessageSquare className="mr-2" size={18} />
                  Feed
                </button>
                <button
                  onClick={() => setActiveTab('graph')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'graph'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Share2 className="mr-2" size={18} />
                  Graph
                </button>
                <button
                  onClick={() => setActiveTab('agents')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === 'agents'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Bot className="mr-2" size={18} />
                  Agents
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                <TweetInput />
                <Feed />
              </div>
            )}
            {activeTab === 'graph' && <GraphCanvas />}
            {activeTab === 'agents' && <AgentsDashboard />}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Trending Topics</h2>
              <div className="space-y-2">
                {['#MachineLearning', '#GraphTheory', '#AI', '#DataScience'].map(
                  (topic) => (
                    <div
                      key={topic}
                      className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      {topic}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;