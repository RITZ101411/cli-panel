import { useState, useRef, useEffect } from "react"
import SendButton from "./SendButton"

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 500)
      textareaRef.current.style.height = newHeight + 'px'
    }
  }, [input])

  const sendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
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
          placeholder="Send a CLI command..."
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
        <SendButton onClick={sendMessage} />
      </div>
    </div>
  );
}
