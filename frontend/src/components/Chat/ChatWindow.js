import React, {useEffect, useState} from 'react';
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatService from "../../services/ChatService";
import ChatUserList from "./ChatUserList";
import LogInWindow from "../Modal/LogInWindow";
import "../../styles/Chat/ChatWindow.css";
import "../../styles/Modal/Modal.css";
import {MessageDataService} from "../../services/MessageDataService";

function ChatWindow() {
    const [allMessage, setAllMessage] = useState([]);
    const [userName, setUserName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const sendMessage = (msg) => {
        ChatService.sendMessage(userName, msg);
    }

    const setTypingStatus = (isTyping) => {
        ChatService.sendTypingStatus(userName, isTyping);
    }

    const onLoginSuccess = (userData) => {
        const currName = userData.userName;
        setUserName(currName);
        setIsOpen(false);
        ChatService.start(currName);
        ChatService.setOnConnectedHandler(() => {
            ChatService.getAllUsers();
            MessageDataService.getAllMessage()
                .then((data)=>{
                    const messages = [];
                    data.forEach(d=>{
                        messages.push({
                            user: d.from,
                            msg: d.content,
                            type: d.from === currName ? 'send' : 'receive',
                            ts: d.sentAt
                        });
                        setAllMessage(prevState => messages);
                    });
                })
        });
        ChatService.setOnGetAllUsersHandler((users) => {
            users = users.filter(u=>u.userName !== currName);
            setAllUsers(users);
        });
    };

    useEffect(()=>{
        openModal();
        ChatService.setReceiveMessageHandler((user, msg) => {
            setAllMessage((prevMsg) => [...prevMsg, {
                user,
                msg,
                type: "receive",
                ts: new Date().toISOString()
            }]);
        });
        ChatService.setSendMessageHandler((user, msg) => {
            MessageDataService.createMessage({
                from: user,
                to: 'all',
                content: msg,
            })
                .then((data)=>{
                    setAllMessage((prevMsg) => [...prevMsg, {
                        user: data.from,
                        msg: data.content,
                        type: "send",
                        ts: data.sentAt
                    }]);
                });

        });
        return () => {
            ChatService.stop();
        };
    }, []);

    useEffect(() => {
        ChatService.setAnnounceUserHandler((user, joined) => {
            if (joined) {
                setAllUsers(prevState => [...prevState, user]);
            } else {
                const newUserList = allUsers.filter(u => u.userName !== user.userName);
                setAllUsers(newUserList)
            }
            setAllMessage((prevMsg) => [...prevMsg, {
                user: user.userName,
                msg: `${user.userName} just ${joined ? 'joined' : 'left'} the chat`,
                type: "status",
                ts: new Date().toISOString()
            }]);
        });
    }, [allUsers]);

    useEffect(() => {
        ChatService.setOnTypingStatusHandler((user, isTyping)=>{
            const hasTyping = allMessage.some(m=>m.user === user && m.type === "typing");
            if (isTyping && !hasTyping) {
                setAllMessage((prevMsg) => [...prevMsg, {
                    user: user,
                    msg: `${user} is typing ....`,
                    type: "typing",
                    ts: new Date().toISOString()
                }]);
            } else if (!isTyping && hasTyping) {
                const newMsgList = allMessage.filter(m=>!(m.type === "typing" && m.user === user));
                setAllMessage(newMsgList);
            }
        });
    }, [allMessage]);

    return (
        <div className="main-window">
            <LogInWindow isOpen={isOpen} onLoginSuccess={onLoginSuccess}></LogInWindow>
            <ChatUserList allUsers={allUsers}></ChatUserList>
            <div className="chat-window">
                <div className="chat-messages">
                    {allMessage.map((obj, index) => (
                        <ChatMessage key={index} message={obj}></ChatMessage>
                    ))}
                </div>
                <ChatInput setTypingStatus={setTypingStatus} sendMessage={sendMessage}></ChatInput>
            </div>
        </div>
    );
}

export default ChatWindow;
