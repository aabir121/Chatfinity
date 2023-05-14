import React, {useEffect, useRef, useState} from 'react';
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatService from "../../services/ChatService";
import ChatLeftPanel from "./ChatLeftPanel";
import LogInWindow from "../Modal/LogInWindow";
import "../../styles/Chat/ChatWindow.css";
import "../../styles/Modal/Modal.css";
import {MessageDataService} from "../../services/MessageDataService";
import {useDispatch, useSelector} from "react-redux";
import {showToast} from "../../actions/toastActions";
import {loadCurrentUser, setUserAvailableFLag} from "../../actions/userListActions";
import {v4 as uuidv4} from 'uuid';
import {setChatWindowParams} from "../../actions/chatWindowActions";

function ChatWindow() {
    const [allMessage, setAllMessage] = useState([]);
    const [userName, setUserName] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const latestMsgRef = useRef(null);
    const dispatch = useDispatch();
    const chatType = useSelector(state => state.chatWindow.chatType);
    const participants = useSelector((state) => state.chatWindow.participants);
    const currUser = useSelector((state) => state.userList.currentUser);
    const participantsRef = useRef(participants);
    participantsRef.current = participants;

    const openModal = () => {
        setShowLoginModal(true);
    };

    const sendMessage = (msg) => {
        const msgBody = {...getSendMsgBody(msg)};
        ChatService.sendMessage(msgBody);
    }

    const setTypingStatus = (isTyping) => {
        ChatService.sendTypingStatus(userName, chatType, participants, isTyping);
    }

    const onLoginModalClose = (userData) => {
        const currName = userData.userName;
        dispatch(showToast('Success', 'Login Successful'));
        dispatch(loadCurrentUser(userData));

        setUserName(currName);
        setShowLoginModal(false);
        dispatch(setChatWindowParams("public", [currName]));

        ChatService.start(currName)
            .then(() => getAllMessages(currName))
            .then(_ => {
                sendMsgHandler();
                announceUserHandler();
            });
    };

    useEffect(() => {
        if (!participants.length) {
            return;
        }

        getAllMessages(userName)
            .then(() => {
                announceUserHandler();
                sendMsgHandler();
                receiveMsgHandler();
                typingStatusHandler();
            });
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

    useEffect(() => {
        if (!currUser || !currUser.userName) {
            ChatService.stop();
            setAllMessage([]);
            setUserName("");
            openModal();
        }
    }, [currUser])

    const typingStatusHandler = () => {
        ChatService.setOnTypingStatusHandler((userName, type, participantsArr, isTyping) => {
            if (chatType !== type || new Set(participantsArr).size !== new Set(participants).size) {
                return;
            }

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
    const getSendMsgBody = (msg) => {
        const msgBody = {
            id: uuidv4(),
            type: chatType,
            sender: userName,
            content: msg,
        };

        msgBody.receiver = chatType === "private" && participants.length > 1 ?
            participants.filter(p => p !== userName)[0] : "";

        return msgBody;
    };

    const sendMsgHandler = () => {
        ChatService.setSendMessageHandler((message) => {
            addMsgResponseToAllResponse(message, true);
        });
    };

    const addMsgResponseToAllResponse = (message, isPending) => {
        const sanitizedMsg = {...message, type: "message", isPending: isPending};

        setAllMessage(prevMsgs => {
            const pendingMsgIndex = prevMsgs.findIndex(msg => msg.isPending && msg.id === message.id);

            if (pendingMsgIndex !== -1) {
                const updatedMsgs = [...prevMsgs];
                updatedMsgs[pendingMsgIndex] = sanitizedMsg;
                return updatedMsgs;
            } else {
                return [...prevMsgs, sanitizedMsg];
            }
        });
    };

    const receiveMsgHandler = () => {
        ChatService.setReceiveMessageHandler((message) => {
            if (
                message.type !== chatType ||
                !participantsRef.current.includes(message.sender) ||
                (message.type === "private" && !participantsRef.current.includes(message.receiver))
            ) {
                return;
            }

            addMsgResponseToAllResponse(message, false);
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
            <ChatLeftPanel></ChatLeftPanel>
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
