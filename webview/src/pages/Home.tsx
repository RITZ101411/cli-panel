import { useState, useRef, useEffect } from "react"
import ChatMessage from "../components/ChatMessage"
import MessageInput from "../components/MessageInput"

interface Message {
  type: string;
  data?: any;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'response';
  text: string;
  timestamp: Date;
}

declare global {
  interface Window {
    acquireVsCodeApi(): {
      postMessage: (message: Message) => void;
    };
  }
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const vscode = useRef<any>(null)

  useEffect(() => {
    try {
      vscode.current = window.acquireVsCodeApi();
    } catch (e) {
      console.log('Not in VSCode environment');
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message: Message = event.data;
      if (message.type === 'response') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'response',
          text: message.data.text,
          timestamp: new Date()
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (vscode.current) {
      vscode.current.postMessage({ type: 'sendPrompt', data: { text: text } });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 select-none">
            <p>Send a prompt</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}
