import { useState, useRef, useEffect } from "react"

export default function Home() {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 500)
      textareaRef.current.style.height = newHeight + 'px'
    }
  }, [input])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4">
        <div className="text-center text-gray-500 mt-8 select-none">
          <p>Send a prompt</p>
        </div>
      </div>

      <div className="p-3 border-t" style={{ borderColor: "var(--vscode-panel-border)" }}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
