import React, { useState, useEffect } from 'react';
import './NotificationChat.css';

const NotificationChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simulating incoming notifications
    const timer = setInterval(() => {
      const randomChange = Math.random() * 10 - 5; // Random change between -5% and 5%
      const newNotification = `Bitcoin price changed by ${randomChange.toFixed(2)}%`;
      setMessages(prev => [...prev, newNotification]);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages(prev => [...prev, `You: ${newMessage}`]);
      setNewMessage('');
    }
  };

  return (
    <div className="notification-chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">{msg}</div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default NotificationChat;