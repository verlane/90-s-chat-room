"use client";

import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
    const [messages, setMessages] = useState<Array<{ content: string }>>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messageQueue = useRef<Array<{ content: string }>>([]);
    const isSending = useRef(false);
    const isJoining = useRef(false);
    const [isFocused, setIsFocused] = useState(false);
    const [username, setUsername] = useState('');
    const pcCommunicationNicknames = process.env.NEXT_PUBLIC_PC_COMMUNICATION_NICKNAMES!!.split(",");
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const [bgColor, setBgColor] = useState('#010084');  // State for background color

    useEffect(() => {
        let storedUsername = Cookies.get('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            renameUser();
        }

        fetchMessages().then(() => {
            if (!isJoining.current) {
                isJoining.current = true
                messageQueue.current.push({content: `< '${storedUsername}' 님이 대화실에 입장했습니다. >`});
            }
        });

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

        let storedBgColor = Cookies.get('bgColor');
        if (storedBgColor) {
            setBgColor(storedBgColor);
            document.body.style.backgroundColor = storedBgColor;  // body의 배경색 초기 설정
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
        if (isScrolledToBottom) {
            scrollToBottom();
        }
    }, [messages, isScrolledToBottom]);

    useEffect(() => {
        const chatBox = chatBoxRef.current;
        if (chatBox) {
            const handleScroll = () => {
                const isAtBottom = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 1;
                setIsScrolledToBottom(isAtBottom);
            };
            chatBox.addEventListener('scroll', handleScroll);
            return () => chatBox.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleBgColorChange = (color: string) => {
        setBgColor(color);
        Cookies.set('bgColor', color, {expires: 365});
        document.body.style.backgroundColor = color;  // body의 배경색 변경
    };


    const renameUser = (newUsername = '') => {
        if (!newUsername) {
            const randomIndex = Math.floor(Math.random() * pcCommunicationNicknames.length);
            newUsername = pcCommunicationNicknames[randomIndex];
        }

        newUsername = newUsername.slice(0, 6);

        Cookies.set('username', newUsername, {expires: 365});
        setUsername(newUsername)
        return newUsername;
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
        if (!input.trim()) return;

        let newMessage = {content: `${username} : ${input}`};

        const params = input.trim().split(' ');
        if (params[0].toLowerCase() === 'n') {
            const newUsername = (params.length > 1 && params[1]) ? params[1] : '';
            newMessage = {content: `< '${username}' 님이 대화명을 '${renameUser(newUsername)}' 로 변경했습니다. >`};
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

        setIsScrolledToBottom(true);
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
        <div className="container" style={{backgroundColor: bgColor}}>
            <div className="welcome">나우누리에 오신 것을 환영합니다</div>
            <div className="color-menu">
                <button onClick={() => handleBgColorChange('#010084')} style={{backgroundColor: '#010084'}}></button>
                <button onClick={() => handleBgColorChange('#000000')} style={{backgroundColor: '#000000'}}></button>
            </div>
            <ul className="menu">
                <li>1. 공지사항</li>
                <li>2. 자유게시판</li>
                <li className="selected"><span>3. 대화실</span></li>
                <li>4. 동호회 / 모임</li>
                <li>5. 자료실</li>
                <li><a href={"https://github.com/verlane/90-s-chat-room"} target={"_blank"}>6. GitHub</a></li>
            </ul>
            <div className="chat-box" ref={chatBoxRef}>
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
                    onKeyUp={handleKeyPress}
                    placeholder="  대화를 시작하세요 ('N' 또는 'N 대화명')"
                />
                <span id="cursor" className={`cursor ${isFocused ? 'blink' : ''}`}></span>
                <span id="text-display" className="text-display"></span>
            </div>
        </div>
    );
}