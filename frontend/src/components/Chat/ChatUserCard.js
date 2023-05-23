import "../../styles/Chat/ChatUserCard.css";
import React from "react";
import {formatTimeAgo} from "./Utils";
import UserAvatar from "../Common/UserAvatar";

function ChatUserCard({user, index, onItemClick}) {
    const shouldShowLastOnline = !user.isOnline && !!user.lastOnline;
    const lastOnlineText = shouldShowLastOnline ? formatTimeAgo(user.lastOnline) : "";

    return (
        <div className="user-list-card">
            <li className={`user ${user.isOnline ? "online" : "offline"} ${user.isSelected ? 'selected' : ''}`}
                onClick={(user) => onItemClick(index)} key={index}>
                <UserAvatar avatarStr={user.avatar}/>
                <div className="user-info">
                    <div className="full-name">{user.fullName}</div>
                    {shouldShowLastOnline && <div className="last-seen">Last online {lastOnlineText}</div>}
                </div>
                <div className={`status-dot ${user.isOnline ? "online" : "offline"}`}></div>
            </li>
        </div>
    );
}

export default ChatUserCard;