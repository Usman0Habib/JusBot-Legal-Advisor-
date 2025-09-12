
export type Sender = 'user' | 'ai';

export interface Message {
  id: string;
  sender: Sender;
  text: string;
}

export enum CallStatus {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  SPEAKING = 'speaking',
  ERROR = 'error',
}
