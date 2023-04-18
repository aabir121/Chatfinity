import React from "react";
import "../../styles/Chat/ChatUserList.css";

function ChatUserList({allUsers}) {
    const noUsers = allUsers.length === 0;

    return (
        <div className={`chat-user-list ${noUsers ? "no-users" : ""}`}>
            <h2 className="user-list-header">Online Users:</h2>
            {noUsers ? (
                <p className="no-users-message">No Users Online</p>
            ) : (
                <ul className="user-list">
                    {allUsers.map((user) => (
                        <li key={user.connectionId}>{user.userName}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ChatUserList;