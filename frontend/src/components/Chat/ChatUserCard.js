import "../../styles/Chat/ChatUserCard.css";
import React from "react";
import {formatTimeAgo} from "./Utils";

function ChatUserCard({user, index, onItemClick}) {
    const shouldShowLastOnline = !user.isOnline && !!user.lastOnline;
    const lastOnlineText = shouldShowLastOnline ? formatTimeAgo(user.lastOnline) : "";

    return (
        <div className="user-list-card">
            <li className={`user ${user.isOnline ? "online" : "offline"} ${user.isSelected ? 'selected' : ''}`}
                onClick={(user) => onItemClick(index)} key={index}>
                <div className="avatar"></div>
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