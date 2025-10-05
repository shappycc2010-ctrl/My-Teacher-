
import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [studentName, setStudentName] = useState('Student');

  const send = async () => {
    try {
      const res = await axios.post('https://my-teacher-backend.onrender.com/api/ai', { message });
      setReply(res.data.reply);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>Hello, {studentName} 👋</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Mr. Kelly something..."
      />
      <button onClick={send}>Send</button>
      <p className="reply">{reply}</p>
    </div>
  );
}

export default App;
