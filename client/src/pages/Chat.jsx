import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState("general"); // example chatId

  useEffect(() => {
    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageData = { chatId, content: input };
    try {
      await API.post("/messages", messageData);
      socket.emit("sendMessage", messageData);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender.username}: </strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
