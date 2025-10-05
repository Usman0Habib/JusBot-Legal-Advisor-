import React, { useState, useCallback, useRef, useEffect } from 'react';
import { startChatSession } from '../services/geminiService';
import { getAudioFromText } from '../services/elevenLabsService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { CallStatus, Message } from '../types';
import CallInterface from './CallInterface';
import { Chat } from '@google/genai';
import ConversationLog from './ConversationLog';

interface VoiceCallViewProps {
    onClose: () => void;
    messages: Message[];
    chatRef: React.MutableRefObject<Chat | null>;
    onNewMessage: (message: Message) => void;
}

const VoiceCallView: React.FC<VoiceCallViewProps> = ({ onClose, messages, chatRef, onNewMessage }) => {
  const [status, setStatus] = useState<CallStatus>(CallStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Effect cleanup: stop any playing audio when the component unmounts.
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
            URL.revokeObjectURL(audioRef.current.src);
        }
      }
    };
  }, []);

  const processAudioFlow = useCallback(async (transcript: string) => {
    if (!transcript || !chatRef.current) return;
    
    // Stop any currently playing audio before starting a new one.
    if (audioRef.current) {
        audioRef.current.pause();
    }

    setStatus(CallStatus.PROCESSING);
    onNewMessage({ id: Date.now().toString(), sender: 'user', text: transcript });

    try {
      const result = await chatRef.current.sendMessage([{ text: transcript }]);
      const aiResponseText = result.text;
      onNewMessage({ id: `${Date.now()}-ai`, sender: 'ai', text: aiResponseText });

      // Strip markdown for bold (**) and italic (*) for clean speech synthesis
      const textForSpeech = aiResponseText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      const audioBlob = await getAudioFromText(textForSpeech);
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio; // Store the new audio object

      newAudio.onplaying = () => setStatus(CallStatus.SPEAKING);
      newAudio.onended = () => {
          setStatus(CallStatus.IDLE);
          URL.revokeObjectURL(audioUrl); // Clean up after playback
      };
      newAudio.onerror = () => {
          setError("An error occurred while trying to play the audio.");
          setStatus(CallStatus.ERROR);
          URL.revokeObjectURL(audioUrl); // Clean up on error
      };

      newAudio.play().catch(e => {
          console.error("Audio playback failed:", e);
          setError("Could not play the audio response.");
          setStatus(CallStatus.ERROR);
          URL.revokeObjectURL(audioUrl); // Clean up on play failure
      });
      
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(CallStatus.ERROR);
      onNewMessage({ id: `${Date.now()}-error`, sender: 'ai', text: `Sorry, an error occurred: ${errorMessage}` });
    }
  }, [chatRef, onNewMessage]);

  const { isListening, startListening, stopListening, browserSupportsSpeechRecognition } = useSpeechRecognition(processAudioFlow);
  
  useEffect(() => {
      if (isListening) {
          setStatus(CallStatus.LISTENING);
      } else if (status === CallStatus.LISTENING) {
          // This allows the processing to start after listening stops.
          // The status will be updated to PROCESSING inside processAudioFlow.
      }
  }, [isListening, status]);


  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      setStatus(CallStatus.ERROR);
      return;
    }
    
    if (status === CallStatus.IDLE || status === CallStatus.ERROR) {
      setError(null);
      startListening();
    } else if (status === CallStatus.LISTENING) {
      stopListening();
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 text-center shadow-md flex-shrink-0">
            <h1 className="text-3xl font-bold">JusBot Voice Call</h1>
            <p className="opacity-90 text-md">Your audio-based conversational partner.</p>
        </header>

        <main className="flex-grow flex flex-col items-center justify-between p-6 bg-white overflow-hidden">
            <ConversationLog messages={messages} />
            <div className="flex flex-col items-center justify-center">
              <CallInterface status={status} onMicClick={handleMicClick} onHangUpClick={onClose} />
              {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}
              {!browserSupportsSpeechRecognition && <p className="text-yellow-600 mt-4 text-center">Your browser does not support speech recognition.</p>}
            </div>
        </main>
    </div>
  );
};

export default VoiceCallView;