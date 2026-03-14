import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PlusIcon, SendHorizontal, Trash2, MessageSquare, Menu, Mic, MicOff, Image as ImageIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './MedicalAdvice.css';

const MedicalAdvice = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const location = useLocation();

    const API_BASE = 'http://localhost:5000/api/chat';
    const VOICE_API = 'http://localhost:5000/api/voice/voice-message';

    useEffect(() => {
        fetchSessions();
        
        // Handle initial context if navigating from Symptom Analyzer
        if (location.state && location.state.initialContext && !currentSessionId) {
            handleInitialContext(location.state.initialContext);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleInitialContext = async (context) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/message`, {
                initialContext: context
            });

            if (res.data.success) {
                setMessages(res.data.messages);
                setCurrentSessionId(res.data.sessionId);
                fetchSessions();
            }
        } catch (err) {
            console.error("Initial Context Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = handleStopRecording;
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleStopRecording = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'consultation.wav');
        if (currentSessionId) {
            formData.append('sessionId', currentSessionId);
        }

        setIsLoading(true);
        try {
            const res = await axios.post(VOICE_API, formData);
            if (res.data.success) {
                setMessages(res.data.messages || [
                    ...messages,
                    { role: 'user', content: res.data.user_text },
                    { role: 'assistant', content: res.data.ai_text }
                ]);
                setCurrentSessionId(res.data.sessionId);
                fetchSessions();

                // Play back AI response if audio exists
                if (res.data.audios && res.data.audios.length > 0) {
                    let currentAudio = 0;
                    const playNext = () => {
                        if (currentAudio < res.data.audios.length) {
                            const audio = new Audio(`data:audio/wav;base64,${res.data.audios[currentAudio]}`);
                            audio.onended = playNext;
                            audio.play().catch(e => console.error("Audio playback failed", e));
                            currentAudio++;
                        }
                    };
                    playNext();
                } else if (res.data.audio) {
                    const audio = new Audio(`data:audio/wav;base64,${res.data.audio}`);
                    audio.play().catch(e => console.error("Audio playback failed", e));
                }
            }
        } catch (err) {
            console.error("Voice Send Error:", err);
        } finally {
            setIsLoading(false);
        }
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        if (currentSessionId) {
            formData.append('sessionId', currentSessionId);
        }
        if (input.trim()) {
            formData.append('message', input);
        }
        formData.append('image', file);

        setInput('');
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/message`, formData);

            if (res.data.success) {
                setMessages(res.data.messages);
                setCurrentSessionId(res.data.sessionId);
                fetchSessions();
            }
        } catch (err) {
            console.error("Image Upload Error:", err);
            alert("Failed to upload and analyze image.");
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
                            <span>{session.title || 'Untitled Session'}</span>
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
                                {msg.imageUrl && (
                                    <div className="message-image">
                                        <img src={`http://localhost:5000${msg.imageUrl}`} alt="Analyzed" />
                                    </div>
                                )}
                                {msg.role === 'assistant' ? (
                                    <div className="markdown-content">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.content
                                )}
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
                        <button 
                            type="button" 
                            className={`voice-btn ${isRecording ? 'recording' : ''}`}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <button 
                            type="button" 
                            className="image-upload-btn"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <ImageIcon size={20} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                        />
                        <input 
                            type="text" 
                            className="chat-input" 
                            placeholder="Describe your symptoms or record voice..." 
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

export default MedicalAdvice;
