'use client';

import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  text: string;
  type: 'user' | 'other' | 'join' | 'left';
}

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    newSocket.on('message', (msg: string) => {
      setMessages((prev) => [...prev, { text: msg, type: 'other' }]);
    });

    newSocket.on('join', (data: { message: string }) => {
      setMessages((prev) => [...prev, { text: data.message, type: 'join' }]);
    });

    newSocket.on('left', (data: { message: string }) => {
      setMessages((prev) => [...prev, { text: data.message, type: 'left' }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('chat', message);
      setMessages((prev) => [...prev, { text: message, type: 'user' }]);
      setMessage('');
    }
  };

  const getMessageStyle = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return 'bg-orange-500 text-white ml-auto';
      case 'other':
        return 'bg-gray-200 text-gray-800';
      case 'join':
        return 'bg-green-500 text-white mx-auto';
      case 'left':
        return 'bg-red-500 text-white mx-auto';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2 flex">
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${getMessageStyle(
                  msg.type
                )}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
