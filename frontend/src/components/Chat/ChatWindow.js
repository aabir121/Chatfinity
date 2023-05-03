import React, {useEffect, useState} from 'react';
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatService from "../../services/ChatService";
import ChatUserList from "./ChatUserList";
import LogInWindow from "../Modal/LogInWindow";
import "../../styles/Chat/ChatWindow.css";
import "../../styles/Modal/Modal.css";

function ChatWindow() {
    const [allMessage, setAllMessage] = useState([]);
    const [user, setUser] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };


    useEffect(()=>{
        openModal();

        return () => {
            ChatService.stop();
        };
    }, []);

    useEffect(() => {
        ChatService.setOnConnectedHandler(() => {
            ChatService.getAllUsers();
        });
    }, [user]);

    useEffect(() => {
        ChatService.setReceiveMessageHandler((user, msg) => {
            setAllMessage((prevMsg) => [...prevMsg, {
                user,
                msg,
                type: "receive",
                ts: new Date().toISOString()
            }]);
        });
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
        ChatService.setSendMessageHandler((user, msg) => {
            setAllMessage((prevMsg) => [...prevMsg, {
                user,
                msg,
                type: "send",
                ts: new Date().toISOString()
            }]);
        });
    }, []);

    useEffect(() => {
        ChatService.setOnGetAllUsersHandler((users) => {
            users = users.filter(u=>u.userName !== user);
            setAllUsers(users);
        });
    }, [user]);

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

    const sendMessage = (msg) => {
        ChatService.sendMessage(user, msg);
    }

    const setTypingStatus = (isTyping) => {
        ChatService.sendTypingStatus(user, isTyping);
    }

    const onLoginSuccess = (userData) => {
        setUser(userData.userName);
        setIsOpen(false);
        ChatService.start(userData.userName);
    };

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
