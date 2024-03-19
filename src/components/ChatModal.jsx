import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai'
import OpenAI from 'openai';
import ChatMovieRecs from './ChatMovieRecs';


const ChatModal = ({ onClose }) => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [threadId, setThreadId] = useState('');
    const [movieRecommendations, setMovieRecommendations] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        console.log(movieRecommendations);
    }, [movieRecommendations])

    const fetchOpenAIResponse = async (prompt, threadId) => {
        try {
            const response = await axios.post('https://us-central1-showmate-d8cfa.cloudfunctions.net/chatWithOpenAIAssistant', { prompt, threadId });
            console.log(response.data.messageList);
            return response.data;
        } catch (error) {
            console.error('Error fetching response:', error);
        }
    };

    const sendMessage = async () => {
        const trimmed = userInput.trim();
        if (!trimmed) return;

        setMessages([...messages, { sender: 'user', text: trimmed }]);
        setUserInput('');

        const response = await fetchOpenAIResponse(`${trimmed}`, threadId);
        const delimiter = response.messageList[0].lastIndexOf("{");
        const endDelimiter = response.messageList[0].lastIndexOf("}");
        let message;

        if (delimiter !== -1) {
            const newStr = response.messageList[0].substring(delimiter, endDelimiter + 1);
            const newStrTrimmed = newStr.trim();
            console.log(newStrTrimmed);
            const obj = JSON.parse(newStrTrimmed);
            console.log(obj);
            message = response.messageList[0].substring(0, delimiter).trim();
            setMessages(messages => [...messages, { sender: 'ai', text: message, type: '' }]);
            setMovieRecommendations(obj);
            setMessages(messages => [...messages, { sender: 'user', text: '', type: 'moviePreferences' }]);
        } else {
            message = response.messageList[0];
            setMessages(messages => [...messages, { sender: 'ai', text: message, type: '' }]);
        }

        if (threadId === '') {
            setThreadId(response.threadId);
        }


    };

    return ReactDOM.createPortal(
        <div className="fixed bottom-0 bg-black bg-opacity-50 flex justify-center items-center h-[90vh] p-2 w-full md:p-8 z-40">
            <div className="w-full md:w-[50%] h-full bg-gray-900 bg-opacity-90 flex flex-col justify-between rounded-lg relative p-4">
                <p onClick={onClose} className='absolute text-gray-300 top-1 right-1 cursor-pointer z-40'>
                    <AiOutlineClose />
                </p>
                <div className="overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.type === 'moviePreferences' ? (
                                <ChatMovieRecs moviePreferences={movieRecommendations} />
                            ) : (
                                <div className={`inline-block ${msg.sender === 'user' ? 'bg-yellow-600' : 'bg-gray-300 text-black'} rounded-lg p-2 m-1`}>
                                    <span className="text-left block">
                                        {msg.text}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex justify-end items-center mt-2">
                    <input
                        ref={inputRef}
                        className='flex-1 pl-2'
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="ml-2 text-white" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>,
        document.body
    );

};

export default ChatModal;
