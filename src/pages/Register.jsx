 
import { useState, useContext } from "react";
import API from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", { username, email, password });
      setUser(data);
      alert("Registration successful!");
    } catch (err) {
      alert(err.response.data.message || "Error registering");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
