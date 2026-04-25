import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import api from "../../config/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  "What classes do you offer?",
  "How much is membership?",
  "How do I book a class?",
  "Who are the trainers?",
  "What are your hours?",
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Ember, your Ember Gym assistant 🔥 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep chat scrolled to bottom dynamically
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Add a blank "assistant" bubble that we will type the stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      // Only send the last 5 messages to keep Ollama fast
      const contextWindow = newMessages.slice(-5);

      // Grab Laravel's CSRF token so fetch is allowed to make a POST request
      const csrfToken = document.cookie.split("; ").find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];

      // Use fetch because it natively supports streaming, unlike Axios
      // Use fetch because it natively supports streaming, unlike Axios
      const response = await fetch('https://embergym.onrender.com/api/chatbot', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "text-event-stream",
        "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
    },
    body: JSON.stringify({ messages: contextWindow }),
});

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // The moment the first word arrives, stop the bouncing loading dots
        setIsLoading(false); 

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.message?.content) {
                // Stitch the new word onto the end of the last message bubble
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: updated[lastIndex].content + data.message.content,
                  };
                  return updated;
                });
                
                // Keep the chat scrolled to the bottom as the AI types
                scrollToBottom(); 
              }
            } catch (e) {
              // Ignore incomplete JSON chunks, they will parse on the next loop
            }
          }
        }
      }
    } catch (error: any) {
      console.error("ChatBot Stream Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, I lost my connection! Please try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showQuickActions = messages.length === 1;

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-80 sm:w-96 flex flex-col bg-gray-900 border border-orange-500/30 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Ember Assistant</p>
                <p className="text-white/75 text-xs">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          {/* 🔥 FIX: Removed min-h-[300px] so the gap isn't forced to be huge */}
          <div className="overflow-y-auto p-4 space-y-3 max-h-[400px]">
            {messages.map((msg, i) => {
              // 🔥 FIX: Hide the bubble if there is no text yet!
              if (!msg.content) return null;

              return (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-tr-sm"
                        : "bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 flex-shrink-0">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 border border-orange-500/20 hover:border-orange-500/50 text-gray-300 hover:text-white px-3 py-1.5 rounded-full transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 bg-gray-950 border-t border-gray-800 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-gray-900 text-white text-sm rounded-full px-4 py-2 border border-gray-700 focus:border-orange-500/50 focus:outline-none placeholder-gray-500 disabled:opacity-50 transition-colors"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center hover:shadow-xl hover:shadow-orange-500/50 hover:scale-110 transition-all"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
}