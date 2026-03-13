import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PlusIcon, SendHorizontal, Trash2, MessageSquare, Menu } from 'lucide-react';
import './MedicalChat.css';

const MedicalChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    const API_BASE = 'http://localhost:5000/api/chat';

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchSessions = async () => {
        try {
            const res = await axios.get(`${API_BASE}/sessions`);
            setSessions(res.data);
        } catch (err) {
            console.error("Error fetching sessions:", err);
        }
    };

    const loadSession = async (sessionId) => {
        try {
            setCurrentSessionId(sessionId);
            const res = await axios.get(`${API_BASE}/sessions/${sessionId}`);
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error("Error loading session:", err);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([]);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput('');
        
        // Optimistic update
        const tempMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(tempMessages);
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/message`, {
                message: userMessage,
                sessionId: currentSessionId
            });

            if (res.data.success) {
                setMessages(res.data.messages);
                setCurrentSessionId(res.data.sessionId);
                fetchSessions(); // Refresh sidebar
            }
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages([...tempMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSession = async (e, sessionId) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API_BASE}/sessions/${sessionId}`);
            if (currentSessionId === sessionId) {
                startNewChat();
            }
            fetchSessions();
        } catch (err) {
            console.error("Error deleting session:", err);
        }
    };

    return (
        <div className="chat-container">
            {/* Sidebar */}
            <div className={`chat-sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                <div className="sidebar-header">
                    <button className="new-chat-btn" onClick={startNewChat}>
                        <PlusIcon size={18} /> New Consultation
                    </button>
                </div>
                
                <div className="chat-history">
                    <p className="history-label">Past Consultations</p>
                    {sessions.map((session) => (
                        <div 
                            key={session._id} 
                            className={`history-item ${currentSessionId === session._id ? 'active' : ''}`}
                            onClick={() => loadSession(session._id)}
                        >
                            <MessageSquare size={16} className="item-icon" />
                            <span>{session.title}</span>
                            <button className="delete-session" onClick={(e) => deleteSession(e, session._id)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat */}
            <main className="chat-main">
                <header className="chat-header">
                    <div className="header-left">
                        <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu size={20} />
                        </button>
                        <h1>Healify AI Assistant</h1>
                    </div>
                </header>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="welcome-card">
                                <h2>How can I help you today?</h2>
                                <p>Describe your symptoms or ask medical questions. I'm here to provide guidance and home remedies.</p>
                                <div className="suggestion-chips">
                                    <button onClick={() => setInput("I have a persistent headache")}>"I have a headache..."</button>
                                    <button onClick={() => setInput("What are some home remedies for a sore throat?")}>"Sore throat remedies..."</button>
                                    <button onClick={() => setInput("Should I see a doctor for a fever?")}>"When to see a doctor..."</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))
                    )}
                    
                    {isLoading && (
                        <div className="message assistant loading">
                            <div className="typing-indicator">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <form className="input-wrapper" onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            className="chat-input" 
                            placeholder="Describe your symptoms..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                            <SendHorizontal size={20} />
                        </button>
                    </form>
                    <p className="disclaimer">
                        AI-generated advice should not replace professional medical consultation.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default MedicalChat;
