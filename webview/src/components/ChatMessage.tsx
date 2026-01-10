interface ChatMessageProps {
  message: {
    id: string;
    type: 'user' | 'output' | 'error';
    text: string;
    timestamp: Date;
    outputType?: 'stdout' | 'stderr';
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const getMessageStyle = () => {
    switch (message.type) {
      case 'user':
        return 'bg-blue-600 text-white justify-end';
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-300 justify-start';
      case 'output':
        return message.outputType === 'stderr' 
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 justify-start'
          : 'bg-gray-100 text-gray-800 justify-start';
      default:
        return 'bg-gray-200 text-black justify-start';
    }
  };

  return (
    <div className={`flex ${getMessageStyle().includes('justify-end') ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-[90%] whitespace-pre-wrap break-words font-mono text-sm ${getMessageStyle()}`}>
        {message.text}
      </div>
    </div>
  );
}
