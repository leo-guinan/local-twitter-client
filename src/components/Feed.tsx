import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Share2, Globe, AlertCircle } from 'lucide-react';

interface Tweet {
  id: number;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLocal?: boolean;
}

const SAMPLE_TWEETS: Tweet[] = [
  {
    id: 1,
    author: 'John Doe',
    handle: '@johndoe',
    content: 'Just deployed my first AI model! 🚀 #MachineLearning',
    timestamp: '2h ago',
    likes: 42,
    replies: 5,
    isLocal: false,
  },
  {
    id: 2,
    author: 'Jane Smith',
    handle: '@janesmith',
    content: 'Graph theory is fascinating! Working on a new visualization project.',
    timestamp: '4h ago',
    likes: 28,
    replies: 3,
    isLocal: false,
  },
];

export function Feed() {
  const [tweets, setTweets] = useState<Tweet[]>(SAMPLE_TWEETS);

  useEffect(() => {
    const handleNewTweet = (event: CustomEvent<Tweet>) => {
      setTweets(prev => [event.detail, ...prev]);
    };

    window.addEventListener('newLocalTweet', handleNewTweet as EventListener);
    return () => {
      window.removeEventListener('newLocalTweet', handleNewTweet as EventListener);
    };
  }, []);

  const handlePushToRemote = (tweet: Tweet) => {
    // In a real app, this would push to Twitter's API
    console.log('Pushing to remote:', tweet);
    alert('In a real app, this would push to Twitter');
  };

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{tweet.author}</span>
                <span className="text-gray-500">{tweet.handle}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{tweet.timestamp}</span>
                {tweet.isLocal && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    Local
                  </span>
                )}
              </div>
              <p className="mt-2">{tweet.content}</p>
              <div className="flex gap-6 mt-3">
                <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                  <MessageCircle size={18} />
                  <span>{tweet.replies}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                  <Heart size={18} />
                  <span>{tweet.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-green-500">
                  <Share2 size={18} />
                </button>
                {tweet.isLocal && (
                  <button
                    onClick={() => handlePushToRemote(tweet)}
                    className="flex items-center gap-1 ml-auto text-blue-500 hover:text-blue-600"
                    title="Push to Twitter"
                  >
                    <Globe size={18} />
                    <span>Push to Twitter</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}