interface SendButtonProps {
  onClick: () => void;
}

export default function SendButton({ onClick }: SendButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-3 right-3 w-8 h-8 rounded-full text-sm flex items-center justify-center"
      style={{
        backgroundColor: "var(--vscode-button-background)",
        color: "var(--vscode-button-foreground)",
        border: "none"
      }}
    >
      ↑
    </button>
  );
}
