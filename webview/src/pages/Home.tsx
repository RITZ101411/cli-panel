import { useState, useRef, useEffect } from "react"

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
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 500)
      textareaRef.current.style.height = newHeight + 'px'
    }
  }, [input])

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (vscode.current) {
      vscode.current.postMessage({ type: 'sendPrompt', data: { text: input } });
    }
    setInput("");
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
              <div key={message.id} className={`${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-black'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t" style={{ borderColor: "var(--vscode-panel-border)" }}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Send a prompt..."
            className="w-full px-3 py-3 pr-16 rounded-lg text-sm resize-none overflow-y-auto"
            style={{
              backgroundColor: "var(--vscode-input-background)",
              color: "var(--vscode-input-foreground)",
              border: "1px solid var(--vscode-input-border)",
              outline: "none",
              minHeight: "36px",
              maxHeight: "500px",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
            rows={1}
          />
          <button
            onClick={sendMessage}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full text-sm flex items-center justify-center"
            style={{
              backgroundColor: "var(--vscode-button-background)",
              color: "var(--vscode-button-foreground)",
              border: "none"
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
