import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function TweetInput() {
  const [thought, setThought] = useState('');

  const handleTweet = () => {
    // In a real app, this would save to local storage
    const newTweet = {
      id: Date.now(),
      author: 'You',
      handle: '@local',
      content: thought,
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      isLocal: true,
    };
    
    // Dispatch custom event to add tweet to feed
    window.dispatchEvent(new CustomEvent('newLocalTweet', { detail: newTweet }));
    setThought('');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="What's on your mind?"
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">
          {thought.length}/280 characters
        </span>
        <button
          onClick={handleTweet}
          disabled={!thought.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
          <span>Save Locally</span>
        </button>
      </div>
    </div>
  );
}