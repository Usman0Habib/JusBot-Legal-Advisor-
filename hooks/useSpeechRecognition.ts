import { useState, useRef, useEffect, useCallback } from 'react';

// FIX: Add type definitions for the Web Speech API to resolve TypeScript errors.
// These interfaces define the shape of the API for TypeScript, which is not part of standard TS DOM types.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  browserSupportsSpeechRecognition: boolean;
}

// FIX: Rename variable to avoid conflict with the global SpeechRecognition type.
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = (onTranscriptReady: (transcript: string) => void): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  // FIX: Use the 'SpeechRecognition' interface as a type.
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const browserSupportsSpeechRecognition = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
         setTranscript(finalTranscript);
         if (onTranscriptReady) {
            onTranscriptReady(finalTranscript);
         }
         stopListening();
      } else {
        const interim = Array.from(event.results)
            .map(res => res[0].transcript)
            .join('');
        setTranscript(interim);
      }
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserSupportsSpeechRecognition]);
  
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);


  return { transcript, isListening, error, startListening, stopListening, browserSupportsSpeechRecognition };
};
