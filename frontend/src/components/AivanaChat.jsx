import { useState } from "react";
import API from "../api";

export default function AivanaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "You", text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await API.post("/aivana/chat", { message: input });
      const botMsg = { sender: "Aivana", text: res.data.reply };

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
      }, 1500); // simulate delay for realism
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "Aivana", text: "⚠️ I’m having trouble connecting right now." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5">
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-2xl rounded-2xl p-4 flex flex-col border border-gray-200">
          <h1 className="text-1.6xl font-bold text-center text-blue-700">
            Aivana AI
          </h1>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-blue-500">
            {messages.map((msg, i) => (
              
              <div
                key={i}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "You"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}

            {/* Typing animation */}
            {isTyping && (
              <div className="flex gap-1 items-center pl-2">
                <span className="bg-gray-300 rounded-full w-2 h-2 animate-bounce"></span>
                <span className="bg-gray-300 rounded-full w-2 h-2 animate-bounce [animation-delay:0.2s]"></span>
                <span className="bg-gray-300 rounded-full w-2 h-2 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          <div className="mt-3 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-l-lg px-2 py-1 text-sm"
              placeholder="Ask Aivana..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 text-sm rounded-r-lg hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        💬 Aivana AI
      </button>
    </div>
  );
}
