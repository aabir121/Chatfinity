import React, {useEffect, useRef, useState} from 'react';
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatService from "../../services/ChatService";
import ChatUserList from "./ChatUserList";
import LogInWindow from "../Modal/LogInWindow";
import "../../styles/Chat/ChatWindow.css";
import "../../styles/Modal/Modal.css";
import {MessageDataService} from "../../services/MessageDataService";
import {useDispatch, useSelector} from "react-redux";
import {showToast} from "../../actions/toastActions";
import {loadCurrentUser, setUserAvailableFLag} from "../../actions/userListActions";

function ChatWindow() {
    const [allMessage, setAllMessage] = useState([]);
    const [userName, setUserName] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const latestMsgRef = useRef(null);
    const dispatch = useDispatch();
    const chatType = useSelector(state => state.chatWindow.chatType);
    const participants = useSelector((state) => state.chatWindow.participants);

    const openModal = () => {
        setShowLoginModal(true);
    };

    const sendMessage = (msg) => {
        ChatService.sendMessage(userName, msg);
    }

    const setTypingStatus = (isTyping) => {
        ChatService.sendTypingStatus(userName, isTyping);
    }

    const onLoginModalClose = (userData) => {
        const currName = userData.userName;
        dispatch(showToast('Success', 'Login Successful'));
        dispatch(loadCurrentUser(currName));

        setUserName(currName);
        setShowLoginModal(false);

        ChatService.start(currName)
            .then(() => getAllMessages(currName))
            .then(_ => {
                sendMsgHandler();
                receiveMsgHandler();
                announceUserHandler();
            });
    };

    useEffect(() => {
        if (!participants.length) {
            return;
        }

        getAllMessages(userName).then(sendMsgHandler);
    }, [chatType, participants]);

    useEffect(() => {
        if (latestMsgRef.current) {
            latestMsgRef.current.scrollIntoView();
        }
        typingStatusHandler();
    }, [allMessage]);

    useEffect(() => {
        openModal();
        return () => {
            ChatService.stop();
        };
    }, []);

    const typingStatusHandler = () => {
        ChatService.setOnTypingStatusHandler((userName, isTyping) => {
            const hasTyping = allMessage.some(m => m.sender === userName && m.type === "typing");
            if (isTyping && !hasTyping) {
                setAllMessage((prevMsg) => [...prevMsg, {
                    sender: userName,
                    content: `${userName} is typing ....`,
                    type: "typing",
                    timestamp: new Date().toISOString()
                }]);
            } else if (!isTyping && hasTyping) {
                const newMsgList = allMessage.filter(m => !(m.type === "typing" && m.sender === userName));
                setAllMessage(newMsgList);
            }
        });
    };

    const sendMsgHandler = () => {
        ChatService.setSendMessageHandler((userName, msg) => {
            const msgBody = {
                type: chatType,
                sender: userName,
                content: msg,
            };

            msgBody.receiver = chatType === "private" && participants.length > 1 ?
                participants.filter(p=>p !== userName)[0] : "";

            MessageDataService.createMessage(msgBody)
                .then((data) => {
                    setAllMessage((prevMsg) => [...prevMsg, {
                        ...data, type: "message"
                    }]);
                });
        });
    };

    const receiveMsgHandler = () => {
        ChatService.setReceiveMessageHandler((userName, msg) => {
            setAllMessage((prevMsg) => [...prevMsg, {
                sender: userName,
                content: msg,
                type: "message",
                timestamp: new Date().toISOString()
            }]);
        });
    };

    const announceUserHandler = () => {
        ChatService.setAnnounceUserHandler((msgUser, joined) => {
            dispatch(setUserAvailableFLag(msgUser.userName, joined));
            setAllMessage((prevMsg) => [...prevMsg, {
                sender: msgUser.userName,
                content: `${msgUser.userName} just ${joined ? 'joined' : 'left'} the chat`,
                type: "status",
                timestamp: new Date().toISOString()
            }]);
        });
    };

    const getAllMessages = (currUserName) => {
        const getMessagesPromise = chatType === "public" ?
            MessageDataService.getPublicChat() : MessageDataService.getPrivateChat(participants);

        return getMessagesPromise.then((data) => {
            const messages = [];
            data.forEach(d => {
                messages.push({
                    ...d, type: 'message'
                });
            });
            setAllMessage(prevState => messages);
        });
    };

    return (
        <div className="main-window">
            <LogInWindow show={showLoginModal} handleClose={onLoginModalClose}></LogInWindow>
            <ChatUserList></ChatUserList>
            <div className="chat-window">
                <div className="chat-messages">
                    {allMessage.map((obj, index) => (
                        <div ref={index === allMessage.length - 1 ? latestMsgRef : null} key={obj.timestamp}>
                            <ChatMessage prevMessageObj={index > 1 ? allMessage[index - 1] : null}
                                         messageObj={obj}></ChatMessage>
                        </div>
                    ))}
                </div>
                <ChatInput setTypingStatus={setTypingStatus} sendMessage={sendMessage}></ChatInput>
            </div>
        </div>
    );
}

export default ChatWindow;
