interface ChatMessageProps {
  message: {
    id: string;
    type: 'user' | 'response';
    text: string;
    timestamp: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-[90%] whitespace-pre-wrap break-words ${
        message.type === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-black'
      }`}>
        {message.text}
      </div>
    </div>
  );
}
