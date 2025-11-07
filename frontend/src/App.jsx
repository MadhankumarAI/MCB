import React, { useEffect, useRef, useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  useEffect(() => {
    // scroll to bottom on new messages
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const connect = () => {
    if (!username) return alert("Please enter a username");
    const socket = new WebSocket(`ws://localhost:8000/ws/${encodeURIComponent(username)}`);

    socket.onopen = () => {
      setConnected(true);
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        // if message is not JSON, show raw
        setMessages((prev) => [...prev, { type: "message", user: "server", message: event.data }]);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      setWs(null);
    };

    socket.onerror = (e) => {
      console.error("WebSocket error", e);
    };
  };

  const sendMessage = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!message) return;
    ws.send(message);
    setMessage("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!connected) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
        <h2>Join Chat</h2>
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && connect()}
          style={{ padding: 8, fontSize: 16 }}
        />
        <button onClick={connect} style={{ marginLeft: 8, padding: 8, fontSize: 16 }}>
          Connect
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 800 }}>
      <h2>Chat — {username}</h2>
      <div
        ref={messagesRef}
        style={{ border: "1px solid #ccc", height: 400, padding: 10, overflowY: "auto", marginBottom: 12 }}
      >
        {messages.map((m, i) => {
          if (m.type === "join") {
            return (
              <div key={i} style={{ color: "#28a745", margin: "6px 0" }}>
                {m.message}
              </div>
            );
          }
          if (m.type === "leave") {
            return (
              <div key={i} style={{ color: "#dc3545", margin: "6px 0" }}>
                {m.message}
              </div>
            );
          }
          return (
            <div key={i} style={{ margin: "6px 0" }}>
              <strong>{m.user}:</strong>&nbsp;{m.message}
            </div>
          );
        })}
      </div>

      <div>
        <input
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          style={{ padding: 8, width: "70%", fontSize: 16 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 8, padding: 8, fontSize: 16 }}>
          Send
        </button>
        <button
          onClick={() => {
            if (ws) ws.close();
          }}
          style={{ marginLeft: 8, padding: 8 }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default App;
