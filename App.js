
import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App(){
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [studentName, setStudentName] = useState('Student');

  const send = async () => {
    try{
      const res = await axios.post(`${process.env.REACT_APP_API_BASE || ''}/api/ai/chat`, {
        message, studentName
      });
      setReply(res.data.reply);
    }catch(err){
      console.error(err);
      setReply('Error contacting Mr. Kelly.');
    }
  };

  const createIntent = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE || ''}/api/payment/intent`, {
      userId: "demo-user",
      plan: "basic",
      payerName: studentName,
      amount: 30
    });
    alert('Payment intent created. Follow bank transfer instructions in README.');
  };

  return (
    <div className="container">
      <div className="left">
        <div className="mrkelly">
          <img src="/mrkelly.png" alt="Mr Kelly" />
          <h2>Mr. Kelly</h2>
          <p className="mood">Hello {studentName} — ask me anything (no homework answers until you submit)</p>
        </div>

        <div className="chat">
          <input placeholder="Your name" value={studentName} onChange={(e)=>setStudentName(e.target.value)} />
          <textarea placeholder="Ask Mr. Kelly..." value={message} onChange={(e)=>setMessage(e.target.value)} />
          <button onClick={send}>Ask Mr. Kelly</button>
          <div className="reply"><strong>Mr. Kelly:</strong> {reply}</div>
        </div>

        <div className="payments">
          <h3>Manual Payment (Account-to-Account)</h3>
          <button onClick={createIntent}>Create Payment Intent</button>
          <p>After creating an intent, transfer funds to the platform bank account (configure in admin).</p>
        </div>
      </div>

      <div className="right">
        <h3>Lesson Panel</h3>
        <ul>
          <li>BWD: Intro to HTML</li>
          <li>SAM: CSS Basics</li>
          <li>AHPW: Advanced HTML & Project</li>
        </ul>

        <h3>Homework Tracker</h3>
        <p>No submissions yet (starter).</p>

        <h3>Leaderboard</h3>
        <p>Top students will appear here.</p>
      </div>
    </div>
  );
}

export default App;
