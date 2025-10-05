import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { Message } from '../types';
import PhoneIcon from './icons/PhoneIcon';
import TypingIndicator from './TypingIndicator';
import JusBotLogo from './icons/JusBotLogo';

interface JusBotTextInterfaceProps {
    onStartCall: () => void;
    messages: Message[];
    chatRef: React.MutableRefObject<Chat | null>;
    onNewMessage: (message: Message) => void;
    status: string;
    model: string;
    setModel: (model: string) => void;
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

const JusBotTextInterface: React.FC<JusBotTextInterfaceProps> = ({ onStartCall, messages, chatRef, onNewMessage, status, model, setModel }) => {
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
        onNewMessage(userMessage);
        setInputValue("");
        setIsLoading(true);

        try {
            if (!chatRef.current) {
                throw new Error("Chat session not initialized.");
            }
            const result = await chatRef.current.sendMessage({ message: inputValue });
            const botMessage: Message = { id: `${Date.now()}-ai`, sender: 'ai', text: result.text };
            onNewMessage(botMessage);
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            console.error("Error details:", error instanceof Error ? error.message : String(error));
            console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
            const errorMessage: Message = { id: `${Date.now()}-error`, sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
            onNewMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 text-center shadow-md flex justify-between items-center flex-shrink-0">
                <div></div>
                <div className="text-center flex flex-col items-center">
                    <div className="flex items-center gap-3">
                        <JusBotLogo className="w-12 h-12" />
                        <h1 className="text-3xl font-bold">JusBot</h1>
                    </div>
                    <p className="opacity-90 text-md">Your AI Legal assistant</p>
                </div>
                <button 
                    onClick={onStartCall}
                    className="p-3 rounded-full hover:bg-white/20 transition-colors duration-300"
                    aria-label="Start voice call"
                >
                    <PhoneIcon className="w-7 h-7 text-white" />
                </button>
            </header>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 p-5 overflow-y-auto bg-slate-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`py-3 px-4 rounded-xl max-w-[85%] break-words ${msg.sender === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-white border border-slate-200 shadow-sm text-gray-800'}`}>
                                {msg.sender === 'ai' && <strong className="block text-indigo-600 mb-1">JusBot:</strong>}
                                {msg.text.split('\n').map((line, i) => <p key={i}>{renderWithMarkdown(line)}</p>)}
                            </div>
                        </div>
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-5 bg-white border-t border-slate-200 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything about legal matters..." 
                            disabled={isLoading}
                            className="flex-1 py-3 px-5 border-2 border-slate-200 rounded-full text-base text-gray-800 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-full cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed shadow-md"
                        >
                            Send
                        </button>
                    </div>
                    <div className={`text-center text-sm ${status.startsWith("Conn") ? "text-red-500" : "text-gray-500"}`}>
                        {isLoading ? "JusBot is thinking..." : status}
                    </div>
                </div>
            </div>

            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 flex-shrink-0">
                <label htmlFor="modelSelect" className="font-semibold text-gray-700">AI Model:</label>
                <select 
                    id="modelSelect"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={isLoading}
                    className="py-2 px-3 border border-slate-300 rounded-lg bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Faster)</option>
                    {/* <option value="gemini-1.5-pro">Gemini 1.5 Pro (More Capable)</option> */}
                </select>
            </div>
        </div>
    );
};

export default JusBotTextInterface;