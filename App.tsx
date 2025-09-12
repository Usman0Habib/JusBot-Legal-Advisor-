import React, { useState, useRef, useEffect } from 'react';
import VoiceCallView from './components/VoiceCallView';
import JusBotTextInterface from './components/JusBotTextInterface';
import { Message } from './types';
import { Chat } from '@google/genai';
import { startChatSession } from './services/geminiService';
import { JUS_BOT_SYSTEM_INSTRUCTION } from './constants';

const App: React.FC = () => {
  const [isVoiceCallActive, setVoiceCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
      { id: 'initial-bot-message', sender: 'ai', text: "Hello! I'm JusBot, your AI legal assistant. How can I help you today? Please remember, I am an AI and cannot provide legal advice." }
  ]);
  const [status, setStatus] = useState("Connecting to JusBot...");
  const [model, setModel] = useState('gemini-2.5-flash');

  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    try {
        chatRef.current = startChatSession(model, JUS_BOT_SYSTEM_INSTRUCTION);
        setStatus("Connected. Ready for your questions.");
    } catch (error) {
        console.error(error);
        setStatus("Connection failed. Please check the API key.");
    }
  }, [model]);
  
  const handleNewMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  if (isVoiceCallActive) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <VoiceCallView 
                onClose={() => setVoiceCallActive(false)} 
                messages={messages}
                chatRef={chatRef}
                onNewMessage={handleNewMessage}
            />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
       <JusBotTextInterface 
            onStartCall={() => setVoiceCallActive(true)}
            messages={messages}
            chatRef={chatRef}
            onNewMessage={handleNewMessage}
            status={status}
            model={model}
            setModel={setModel}
       />
    </div>
  );
};

export default App;