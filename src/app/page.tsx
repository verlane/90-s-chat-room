"use client";

import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
    const [messages, setMessages] = useState<Array<{ content: string }>>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messageQueue = useRef<Array<{ content: string }>>([]);
    const isSending = useRef(false);
    const [isFocused, setIsFocused] = useState(false);
    const [username, setUsername] = useState('');
    const pcCommunicationNicknames = process.env.NEXT_PUBLIC_PC_COMMUNICATION_NICKNAMES!!.split(",");

    useEffect(() => {
        let storedUsername = Cookies.get('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            renameUser();
        }

        fetchMessages();

        const fetchInterval = setInterval(fetchMessages, Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL));
        const deleteInterval = setInterval(deleteMessage, Number(process.env.NEXT_PUBLIC_DELETE_INTERVAL));
        const sendInterval = setInterval(processQueue, Number(process.env.NEXT_PUBLIC_SEND_INTERVAL));

        return () => {
            clearInterval(fetchInterval);
            clearInterval(deleteInterval);
            clearInterval(sendInterval);
        };
    }, []);

    useEffect(() => {
        const inputElement = inputRef.current;
        const cursor = document.getElementById('cursor');
        const textDisplay = document.getElementById('text-display');

        function updateCursorPosition() {
            if (inputElement && cursor && textDisplay) {
                const text = inputElement.value.replace(/ /g, '\u00A0');
                textDisplay.textContent = text || '\u00A0';
                const textWidth = textDisplay.offsetWidth;
                cursor.style.left = `${textWidth + 4}px`;
            }
        }

        if (inputElement) {
            inputElement.addEventListener('input', updateCursorPosition);
            inputElement.addEventListener('focus', () => setIsFocused(true));
            inputElement.addEventListener('blur', () => setIsFocused(false));

            inputElement.focus();
            updateCursorPosition();
        }

        return () => {
            if (inputElement) {
                inputElement.removeEventListener('input', updateCursorPosition);
                inputElement.removeEventListener('focus', () => setIsFocused(true));
                inputElement.removeEventListener('blur', () => setIsFocused(false));
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renameUser = () => {
        const randomIndex = Math.floor(Math.random() * pcCommunicationNicknames.length);
        let storedUsername = pcCommunicationNicknames[randomIndex];
        Cookies.set('username', storedUsername, {expires: 365});
        setUsername(storedUsername)
        return storedUsername;
    }

    const fetchMessages = async () => {
        try {
            const response = await axios.get<Array<{
                content: string;
                id: number
            }>>('/api/messages?offset=0&limit=100');
            if (!isSending.current && messageQueue.current.length < 1) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const deleteMessage = async () => {
        try {
            const response = await axios.get<Array<{
                content: string;
                id: number
            }>>('/api/messages?offset=3000&limit=1');
            if (response.data.length > 0) {
                await axios.delete(`/api/messages/${response.data[0].id}`);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (input.trim()) {
            let newMessage = {content: `${username} : ${input}`};
            if (input.trim() == "N" || input.trim() == "n") {
                newMessage = {content: `== '${username}' 님이 대화명을 '${renameUser()}' 로 변경했습니다. ==`};
            }
            setMessages(prevMessages => [newMessage, ...prevMessages]);
            setInput('');
            messageQueue.current.push(newMessage);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            const cursor = document.getElementById('cursor');
            if (cursor) {
                cursor.style.left = '4px';
            }
        }
    };

    const processQueue = async () => {
        if (!isSending.current && messageQueue.current.length > 0) {
            isSending.current = true;
            const message = messageQueue.current.shift();
            if (message) {
                try {
                    await axios.post('/api/messages', {content: message.content});
                } catch (error) {
                    console.error('Failed to send message:', error);
                } finally {
                    isSending.current = false;
                }
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div className="container">
            <div className="welcome">나우누리에 오신 것을 환영합니다</div>
            <ul className="menu">
                <li>1. 공지사항</li>
                <li>2. 자유게시판</li>
                <li className="selected"><span>3. 대화실</span></li>
                <li>4. 동호회 / 모임</li>
                <li>5. 자료실</li>
                <li></li>
            </ul>
            <div className="chat-box">
                <p>여기에 대화 내용이 표시됩니다.</p>
                <p>대화 내용이 길어지면 스크롤됩니다.</p>
                {messages.slice().reverse().map((message, index) => (
                    <p key={index} className="mb-2">
                        {message.content}
                    </p>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <div className="input-container">
                <input
                    ref={inputRef}
                    id="command"
                    className="textbox"
                    type="text"
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="  대화를 시작하세요. (N:대화명변경)"
                />
                <span id="cursor" className={`cursor ${isFocused ? 'blink' : ''}`}></span>
                <span id="text-display" className="text-display"></span>
            </div>
        </div>
    );
}