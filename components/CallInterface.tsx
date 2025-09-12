import React from 'react';
import { CallStatus } from '../types';
import HangUpIcon from './icons/HangUpIcon';
import JusBotLogo from './icons/JusBotLogo';

interface CallInterfaceProps {
  status: CallStatus;
  onMicClick: () => void;
  onHangUpClick: () => void;
}

const getStatusInfo = (status: CallStatus): { text: string; color: string } => {
  switch (status) {
    case CallStatus.LISTENING:
      return { text: "Listening...", color: 'text-red-500' };
    case CallStatus.PROCESSING:
    case CallStatus.SPEAKING:
      return { text: "JusBot is speaking...", color: 'text-green-500' };
    case CallStatus.ERROR:
      return { text: "An error occurred. Try again.", color: 'text-yellow-500' };
    case CallStatus.IDLE:
    default:
      return { text: "Tap the icon to speak", color: 'text-gray-500' };
  }
};

const CallInterface: React.FC<CallInterfaceProps> = ({ status, onMicClick, onHangUpClick }) => {
  const { text, color } = getStatusInfo(status);

  const isButtonDisabled = status === CallStatus.PROCESSING || status === CallStatus.SPEAKING;
  const isAnimating = status === CallStatus.PROCESSING || status === CallStatus.SPEAKING;
  
  const buttonClasses = `
    w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50 shadow-lg p-2
    bg-gradient-to-r from-indigo-600 to-purple-600
    ${isButtonDisabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-105 active:scale-95'}
  `;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <p className={`text-lg font-medium ${color} transition-colors duration-300 h-6`}>{text}</p>
      <div className="relative flex items-center justify-center h-40 w-40">
        <button
          onClick={onMicClick}
          disabled={isButtonDisabled}
          className={buttonClasses}
          aria-label={status === CallStatus.LISTENING ? 'Stop listening' : 'Start listening'}
        >
          <JusBotLogo className="w-full h-full p-2" isAnimated={isAnimating} />
        </button>
      </div>
      <button 
        onClick={onHangUpClick}
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 shadow-md"
        aria-label="Hang up call"
        >
        <HangUpIcon className="w-5 h-5" />
        End Call
      </button>
    </div>
  );
};

export default CallInterface;
