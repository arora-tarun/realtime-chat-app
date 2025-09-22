// client/src/pages/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const socket = io("http://localhost:5000");

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Inform server of new online user
    socket.emit("newUser", user.username);

    // Receive online users list
    socket.on("onlineUsers", (users) => setOnlineUsers(users));

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      if (data.sender === currentChatUser || data.sender === user.username) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
    };
  }, [user, currentChatUser, navigate]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "" || !currentChatUser) return;

    const data = { content: message, sender: user.username, receiver: currentChatUser };
    socket.emit("sendMessage", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Realtime Chat</h2>
        <div className="flex-1 overflow-y-auto mb-5">
          <p className="text-gray-400 mb-2">Online Users</p>
          {onlineUsers.map((u, idx) => (
            <div
              key={idx}
              className={`p-2 rounded cursor-pointer mb-1 ${
                u === currentChatUser ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setCurrentChatUser(u);
                setMessages([]);
              }}
            >
              {u}
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <p className="text-gray-400 mb-2">Logged in as:</p>
          <p className="font-semibold mb-2">{user.username}</p>
          <button
            className="bg-red-600 hover:bg-red-700 p-2 rounded text-white font-semibold w-full"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col justify-between p-5">
        {currentChatUser ? (
          <>
            <div className="flex-1 overflow-y-auto mb-5">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 p-3 rounded-lg max-w-xs ${
                    msg.sender === user.username
                      ? "bg-blue-600 ml-auto text-right"
                      : "bg-gray-700"
                  }`}
                >
                  <p className="font-semibold text-sm mb-1">{msg.sender}</p>
                  <p>{msg.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <form className="flex gap-2" onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message ${currentChatUser}...`}
                className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
