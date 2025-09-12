import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import TypingIndicator from './TypingIndicator';

interface ConversationLogProps {
  messages: Message[];
}

const renderWithMarkdown = (text: string) => {
    // This regex splits the string by bold (**) or italic (*) markers, keeping them in the result array.
    // The regex `(\*\*.*?\*\*|\*.*?\*)` prioritizes bold (`**`) over italic (`*`) matches.
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Render bold text using <strong>
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            // Render italic text using <em>
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        // Render plain text
        return part;
    });
};

const ConversationLog: React.FC<ConversationLogProps> = ({ messages }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full max-w-lg h-48 bg-slate-50 rounded-lg p-4 overflow-y-auto border border-slate-200">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Conversation will appear here...</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`py-3 px-4 rounded-xl max-w-[85%] break-words ${
                msg.sender === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-white border border-slate-200 shadow-sm text-gray-800'
              }`}
            >
              {msg.sender === 'ai' && <strong className="block text-indigo-600 mb-1">JusBot:</strong>}
              {msg.text.split('\n').map((line, i) => (
                  <p key={i}>{renderWithMarkdown(line)}</p>
              ))}
            </div>
          </div>
        ))
      )}
      <div ref={logEndRef} />
    </div>
  );
};

export default ConversationLog;