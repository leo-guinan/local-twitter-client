import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Minus, X, Link as LinkIcon } from 'lucide-react';

interface Tweet {
  id: string;
  content: string;
  position: { x: number; y: number };
}

interface Connection {
  from: string;
  to: string;
}

interface Point {
  x: number;
  y: number;
}

export function GraphCanvas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggingTweet, setDraggingTweet] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const searchResults = [
    "Exploring graph theory #NetworkScience",
    "New breakthrough in AI connections #MachineLearning",
    "The future of social networks #GraphTheory"
  ];

  const handleAddTweet = (content: string) => {
    const newTweet: Tweet = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      position: { x: 50, y: 50 }
    };
    setTweets(prev => [...prev, newTweet]);
    setSearchQuery('');
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    if (connectingFrom) return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const tweet = tweets.find(t => t.id === id);
    if (!tweet) return;

    const offsetX = (e.clientX - rect.left) / zoom - tweet.position.x;
    const offsetY = (e.clientY - rect.top) / zoom - tweet.position.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggingTweet(id);
    e.preventDefault();
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setMousePosition({ x, y });
    
    if (draggingTweet) {
      setTweets(prev => prev.map(tweet => 
        tweet.id === draggingTweet 
          ? { 
              ...tweet, 
              position: { 
                x: x - dragOffset.x,
                y: y - dragOffset.y
              } 
            }
          : tweet
      ));
    }
  };

  const handleDragEnd = () => {
    setDraggingTweet(null);
  };

  const handleStartConnection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectingFrom(prev => prev === id ? null : id);
  };

  const handleCompleteConnection = (toId: string) => {
    if (!connectingFrom || connectingFrom === toId) return;
    
    const connectionExists = connections.some(
      conn => (conn.from === connectingFrom && conn.to === toId) ||
             (conn.from === toId && conn.to === connectingFrom)
    );
    
    if (!connectionExists) {
      setConnections(prev => [...prev, { from: connectingFrom, to: toId }]);
    }
    setConnectingFrom(null);
  };

  const handleRemoveTweet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTweets(prev => prev.filter(t => t.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
  };

  const getTweetPosition = (id: string): Point | null => {
    const tweet = tweets.find(t => t.id === id);
    return tweet ? tweet.position : null;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setDraggingTweet(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConnectingFrom(null);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[600px] flex flex-col">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search tweets to add to canvas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-200 rounded-lg"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      
      {searchQuery && (
        <div className="mt-2 border border-gray-200 rounded-lg p-2 max-h-40 overflow-y-auto">
          {searchResults.map((tweet, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-50 cursor-pointer rounded"
              onClick={() => handleAddTweet(tweet)}
            >
              {tweet}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 relative">
        <div 
          ref={canvasRef}
          className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden"
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
        >
          <div
            className="w-full h-full"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((connection, index) => {
                const fromPos = getTweetPosition(connection.from);
                const toPos = getTweetPosition(connection.to);
                if (!fromPos || !toPos) return null;

                return (
                  <line
                    key={index}
                    x1={fromPos.x + 132}
                    y1={fromPos.y + 25}
                    x2={toPos.x + 132}
                    y2={toPos.y + 25}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                );
              })}
              {connectingFrom && (
                <line
                  x1={getTweetPosition(connectingFrom)?.x! + 132}
                  y1={getTweetPosition(connectingFrom)?.y! + 25}
                  x2={mousePosition.x}
                  y2={mousePosition.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              )}
            </svg>

            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className={`absolute bg-white p-3 rounded-lg shadow-lg border border-gray-200 w-64 select-none transition-shadow ${
                  connectingFrom === tweet.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: tweet.position.x,
                  top: tweet.position.y,
                  cursor: connectingFrom ? 'crosshair' : draggingTweet === tweet.id ? 'grabbing' : 'grab',
                  zIndex: connectingFrom === tweet.id || draggingTweet === tweet.id ? 10 : 1,
                }}
                onMouseDown={(e) => handleDragStart(tweet.id, e)}
                onClick={() => connectingFrom && handleCompleteConnection(tweet.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <button
                    className={`p-1 rounded transition-colors ${
                      connectingFrom === tweet.id
                        ? 'bg-blue-100 text-blue-500'
                        : 'hover:bg-gray-100 text-gray-500'
                    }`}
                    onClick={(e) => handleStartConnection(tweet.id, e)}
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={(e) => handleRemoveTweet(tweet.id, e)}
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                <p className="text-sm">{tweet.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2 z-50">
          <button 
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
          >
            <Plus size={20} />
          </button>
          <button 
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
          >
            <Minus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}