import "../../styles/Chat/ChatUserCard.css";
import React from "react";

function ChatUserCard({user, index, onItemClick}) {
    return (
        <div className="user-list-card">
            <li className={`user ${user.isOnline ? "online" : "offline"} ${user.isSelected ? 'selected' : ''}`}
                onClick={(user) => onItemClick(index)} key={index}>
                <div className="avatar"></div>
                <div className="user-info">
                    <div className="full-name">{user.fullName}</div>
                    <div className="last-seen">Last seen 5 minutes ago</div>
                </div>
                <div className={`status-dot ${user.isOnline ? "online" : "offline"}`}></div>
            </li>
        </div>
    );
}

export default ChatUserCard;