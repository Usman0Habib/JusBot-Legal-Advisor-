import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="mb-4 flex justify-start">
            <div className="py-3 px-4 rounded-xl max-w-[85%] bg-white border border-slate-200 shadow-sm text-gray-800 flex items-center gap-2">
                <strong className="block text-indigo-600">JusBot:</strong>
                <p className="text-gray-500 italic">is thinking...</p>
            </div>
        </div>
    );
};

export default TypingIndicator;