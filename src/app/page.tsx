"use client";

import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const messageQueue = useRef([]);
    const isSending = useRef(false);
    const [isFocused, setIsFocused] = useState(false);
    const [username, setUsername] = useState('');

    const pcCommunicationNicknames = [
        "해피엔드", "여인2",
        "난캡이야", "일루와", "수학싫어", "셈틀아비", "내리가즘",
        "freeman", "nuclear", "serious", "THIS", "FBI",
        "ILOVEYOU", "wetlips", "은하사랑", "승연사랑", "태지boys",
        "탁이준이", "나의사랑", "너의사랑", "혜선사랑", "종선사랑",
        "아침이슬", "한결같이", "늘푸른솔", "김용환", "서도일",
        "편집국장", "종이뱅기", "같이하자", "깨끗우리", "보라미",
        "무장공비", "칼부림", "마즐레", "구슬두개", "큰고추알",

        "김민수", "이준호", "박지훈", "최현우", "정재훈",
        "강태호", "조성민", "윤도현", "장우진", "임지호",
        "한승민", "오준서", "서지훈", "신동현", "권민준",
        "황준혁", "안성준", "홍지환", "유태현", "문현수",

        "김민지", "이수진", "박지영", "최은지", "정수연",
        "강지혜", "조민서", "윤지은", "장서연", "임지수",
        "한수진", "오지현", "서유진", "신혜진", "권지민",
        "황수빈", "안지연", "홍지수", "유민서", "문지영",

        "햇살가득", "달빛소녀", "별님", "구름조각", "바람의숲", "꿈꾸는사람", "촛불하나", "파도소리", "푸른하늘", "새싹",
        "무지개", "솔방울", "나무꾼", "방울이", "하늘구름", "노을", "산들바람", "물망초", "꽃잎", "나비날개",
        "하얀안개", "달빛그림자", "밤하늘", "모닝커피", "시간여행자", "행복나무", "전자우편", "사이버맨", "네티즌", "웹서퍼",
        "컴쟁이", "키보드", "마우스", "모뎀맨", "윈도우", "도스왕", "채팅왕", "게시판지기", "다운로더", "업로더",
        "정보통", "해커맨", "프로그래머", "그래픽맨", "사운드맨",

        "소방차 119", "영심이", "H.O.T.티", "젝키스틱", "핑클레인저", "S.E.S.TERS", "보아짱", "DSF", "YB밴드", "신화창조", "클릭-B", "NRG엔젤", "GOD주니어", "유앤미", "솔메이트", "강타닷컴", "문희준닷컴", "안젤리안", "박정민팬클럽", "터보엔진", "코요태 친구들", "UP", "이정현 팬클럽", "신승훈 팬클럽", "김건모 팬클럽", "이상우 팬클럽", "조성모 팬클럽", "김민종 팬클럽", "김범수 팬클럽", "신화팬클럽", "이효리 팬클럽",
    ];


    useEffect(() => {
        fetchMessages();
        const fetchInterval = setInterval(fetchMessages, 3000);
        const sendInterval = setInterval(processQueue, 1000);

        const inputElement = inputRef.current;
        const cursor = document.getElementById('cursor');
        const textDisplay = document.getElementById('text-display');

        function updateCursorPosition() {
            const text = inputElement.value.replace(/ /g, '\u00A0');
            textDisplay.textContent = text || '\u00A0';
            const textWidth = textDisplay.offsetWidth;
            cursor.style.left = `${textWidth + 4}px`;
        }

        inputElement.addEventListener('input', updateCursorPosition);
        inputElement.addEventListener('focus', () => setIsFocused(true));
        inputElement.addEventListener('blur', () => setIsFocused(false));

        inputElement.focus();
        updateCursorPosition();

        // 컴포넌트가 마운트될 때 쿠키에서 사용자 이름을 읽습니다.
        let storedUsername = Cookies.get('username');
        if (!storedUsername) {
            const randomIndex = Math.floor(Math.random() * pcCommunicationNicknames.length);
            const storedUsername = pcCommunicationNicknames[randomIndex]
            Cookies.set('username', storedUsername, { expires: 1 });
        }
        setUsername(storedUsername)

        return () => {
            inputElement.removeEventListener('focus', () => {
            });
            inputElement.removeEventListener('blur', () => {
            });
            inputElement.removeEventListener('input', updateCursorPosition);
            clearInterval(fetchInterval);
            clearInterval(sendInterval);
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/messages');
            if (!isSending.current && messageQueue.current.length < 1) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessage = {content: username + " : " + input, id: Date.now()};
            setMessages(prevMessages => [newMessage, ...prevMessages]);
            setInput('');
            messageQueue.current.push(newMessage);
            const inputElement = inputRef.current;
            inputElement.value = '';
            const cursor = document.getElementById('cursor');
            cursor.style.left = '4px';
        }
    };

    const processQueue = async () => {
        if (!isSending.current && messageQueue.current.length > 0) {
            isSending.current = true;
            const message = messageQueue.current.shift();
            try {
                await axios.post('/api/messages', {content: message.content});
            } catch (error) {
                console.error('Failed to send message:', error);
            } finally {
                isSending.current = false;
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div className="container">
            <h1>나우누리에 오신 것을 환영합니다</h1>
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
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="  대화를 시작하세요..."
                />
                <span id="cursor" className={`cursor ${isFocused ? 'blink' : ''}`}></span>
                <span id="text-display" className="text-display"></span>
            </div>
        </div>
    );
}
