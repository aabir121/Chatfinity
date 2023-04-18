import React from 'react';
import PropTypes from "prop-types";
import "../../styles/Chat/ChatMessage.css";

function ChatMessage(props) {
    const {user, msg, type, ts} = props.message;
    const sent = type === "send";
    const isStatus = type === "status";
    const messageClass = `message ${sent ? 'message-sent' : ''}`;

    return (
        <div key={ts}>
            {isStatus ? (
                <div className="status-text">
                    <span>{msg}</span>
                </div>
            ) : (
                <div className={messageClass}>
                    <div className="message-sender">{user}</div>
                    <div className="message-content">{msg}</div>
                </div>
            )}
        </div>
    );
}

ChatMessage.propTypes = {
    message: PropTypes.object.isRequired
}

export default ChatMessage;
