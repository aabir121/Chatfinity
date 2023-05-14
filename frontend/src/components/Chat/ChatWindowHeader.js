import "../../styles/Chat/ChatWindowHeader.css";
import React, {useEffect, useState} from "react";
import {formatTimeAgo} from "./Utils";
import {useSelector} from "react-redux";

function ChatWindowHeader({receiver}) {
    const {allUsers, currentUser} = useSelector((state) => state.userList);
    const participants = useSelector((state) => state.chatWindow.participants);
    const [receiverInfo, setReceiverInfo] = useState({});
    const [lastOnlineText, setLastOnlineText] = useState('');

    useEffect(() => {
        const rcvName = participants.find(u => u !== currentUser.userName);
        const receiver = !rcvName ? allUsers[0] : allUsers.find(u => u.userName === rcvName);
        if (receiver) {
            setReceiverInfo({...receiver}); //TODO currently we dont allow group
        }
    }, [participants, allUsers]);

    useEffect(() => {
        populateLastOnline();
    }, [receiverInfo])

    const populateLastOnline = () => {
        setLastOnlineText(!receiverInfo.isOnline && !!receiverInfo.lastOnline ? formatTimeAgo(receiverInfo.lastOnline) : "");
    }

    return (
        <div className="chat-window-header">
            <div className="avatar"></div>
            <div className="user-info">
                <div className="full-name">{receiverInfo.fullName}</div>
                {!!lastOnlineText && <div className="last-seen">Last online {lastOnlineText}</div>}
            </div>
        </div>
    );
}

export default ChatWindowHeader;