// import { useState, useEffect } from "react";
// import { useSocket } from "../context/SocketContext.jsx";

// const Chat = ({ chatId, user }) => {
//   const socket = useSocket();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   // Listen for incoming messages
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("receiveMessage", (data) => {
//       if (data.chatId === chatId) {
//         setMessages((prev) => [...prev, data]);
//       }
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [socket, chatId]);

//   const sendMessage = () => {
//     if (message.trim() === "") return;
//     const data = { chatId, content: message, sender: user._id };
//     socket.emit("sendMessage", data);
//     setMessages((prev) => [...prev, data]);
//     setMessage("");
//   };

//   return (
//     <div>
//       <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
//         {messages.map((msg, idx) => (
//           <div key={idx}>
//             <strong>{msg.sender.username || "You"}: </strong>
//             {msg.content}
//           </div>
//         ))}
//       </div>
//       <input
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your message..."
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default Chat;
