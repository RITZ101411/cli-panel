import { useState, useRef, useEffect } from "react"
import ChatMessage from "../components/ChatMessage"
import MessageInput from "../components/MessageInput"

interface Message {
  type: string;
  data?: any;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'output' | 'error';
  text: string;
  timestamp: Date;
  outputType?: 'stdout' | 'stderr';
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
      
      switch (message.type) {
        case 'output':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: message.data.type === 'stderr' ? 'error' : 'output',
            text: message.data.text,
            timestamp: new Date(),
            outputType: message.data.type
          }]);
          break;
        case 'processEnd':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'output',
            text: `Process exited with code ${message.data.code}`,
            timestamp: new Date()
          }]);
          break;
        case 'processStopped':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'output',
            text: 'Process stopped',
            timestamp: new Date()
          }]);
          break;
        case 'error':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'error',
            text: `Error: ${message.data.message}`,
            timestamp: new Date()
          }]);
          break;
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
            <p>Send a CLI command</p>
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
