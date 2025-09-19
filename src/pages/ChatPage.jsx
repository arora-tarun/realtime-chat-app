import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import { socket } from "../services/socket.js";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState("global"); // simple global chat for now

  useEffect(() => {
    if (!user) return;

    socket.auth = { token: user.token };
    socket.connect();

    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    socket.on("typing", (data) => {
      console.log("Typing:", data);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.disconnect();
    };
  }, [user, chatId]);

  const sendMessage = async () => {
    if (!message) return;

    // send to backend API
    try {
      const { data } = await API.post("/messages", { content: message, chatId });
      setChatMessages((prev) => [...prev, data]);
      socket.emit("sendMessage", data);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { chatId, userId: user._id, isTyping: true });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Realtime Chat</h2>
      <div style={{ border: "1px solid gray", height: "300px", overflowY: "auto", padding: "10px" }}>
        {chatMessages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender?.username || "You"}:</strong> {msg.content}</p>
        ))}
      </div>
      <input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleTyping}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
