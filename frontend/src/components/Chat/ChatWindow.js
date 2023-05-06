import React, {useEffect, useRef, useState} from 'react';
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatService from "../../services/ChatService";
import ChatUserList from "./ChatUserList";
import LogInWindow from "../Modal/LogInWindow";
import "../../styles/Chat/ChatWindow.css";
import "../../styles/Modal/Modal.css";
import {MessageDataService} from "../../services/MessageDataService";
import {useDispatch} from "react-redux";
import {showToast} from "../../actions/toastActions";
import {loadUsers} from "../../actions/userListActions";

function ChatWindow() {
    const [allMessage, setAllMessage] = useState([]);
    const [userName, setUserName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const latestMsgRef = useRef(null);
    const dispatch = useDispatch();

    const openModal = () => {
        setShowLoginModal(true);
    };

    const sendMessage = (msg) => {
        ChatService.sendMessage(userName, msg);
    }

    const setTypingStatus = (isTyping) => {
        ChatService.sendTypingStatus(userName, isTyping);
    }

    const onLoginSuccess = (userData) => {
        const currName = userData.userName;
        dispatch(showToast('Success', 'Login Successful'));

        setUserName(currName);
        setShowLoginModal(false);
        ChatService.start(currName);
        ChatService.setOnConnectedHandler(() => {
            ChatService.getAllUsers();
            MessageDataService.getAllMessage()
                .then((data)=>{
                    const messages = [];
                    data.forEach(d=>{
                        messages.push({
                            userName: d.from,
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
            dispatch(loadUsers(users));
        });
    };

    useEffect(() => {
        if (latestMsgRef.current) {
            latestMsgRef.current.scrollIntoView();
        }
    }, [allMessage]);

    useEffect(()=>{
        openModal();
        ChatService.setReceiveMessageHandler((userName, msg) => {
            setAllMessage((prevMsg) => [...prevMsg, {
                userName,
                msg,
                type: "receive",
                ts: new Date().toISOString()
            }]);
        });
        ChatService.setSendMessageHandler((userName, msg) => {
            MessageDataService.createMessage({
                from: userName,
                to: 'all',
                content: msg,
            })
                .then((data)=>{
                    setAllMessage((prevMsg) => [...prevMsg, {
                        userName: data.from,
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
        ChatService.setAnnounceUserHandler((msgUser, joined) => {
            if (joined) {
                setAllUsers(prevState => [...prevState, msgUser]);
            } else {
                const newUserList = allUsers.filter(u => u.userName !== msgUser.userName);
                setAllUsers(newUserList)
            }
            setAllMessage((prevMsg) => [...prevMsg, {
                userName: msgUser.userName,
                msg: `${msgUser.userName} just ${joined ? 'joined' : 'left'} the chat`,
                type: "status",
                ts: new Date().toISOString()
            }]);
        });
    }, [allUsers]);

    useEffect(() => {
        ChatService.setOnTypingStatusHandler((userName, isTyping)=>{
            const hasTyping = allMessage.some(m=>m.userName === userName && m.type === "typing");
            if (isTyping && !hasTyping) {
                setAllMessage((prevMsg) => [...prevMsg, {
                    userName,
                    msg: `${userName} is typing ....`,
                    type: "typing",
                    ts: new Date().toISOString()
                }]);
            } else if (!isTyping && hasTyping) {
                const newMsgList = allMessage.filter(m=>!(m.type === "typing" && m.userName === userName));
                setAllMessage(newMsgList);
            }
        });
    }, [allMessage]);

    return (
        <div className="main-window">
            <LogInWindow show={showLoginModal} handleClose={onLoginSuccess}></LogInWindow>
            <ChatUserList></ChatUserList>
            <div className="chat-window">
                <div className="chat-messages">
                    {allMessage.map((obj, index) => (
                        <div ref={index === allMessage.length - 1 ? latestMsgRef : null} key={obj.ts}>
                            <ChatMessage prevMessageObj={index > 1 ? allMessage[index - 1] : null} messageObj={obj}></ChatMessage>
                        </div>
                    ))}
                </div>
                <ChatInput setTypingStatus={setTypingStatus} sendMessage={sendMessage}></ChatInput>
            </div>
        </div>
    );
}

export default ChatWindow;
