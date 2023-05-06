import React from 'react';
import PropTypes from "prop-types";
import "../../styles/Chat/ChatMessage.css";
import {Tooltip, OverlayTrigger} from "react-bootstrap";

function ChatMessage(props) {
    const {userName, msg, type, ts} = props.messageObj;
    const {userName: prevName, type: prevType} = props.prevMessageObj || {};
    const sent = type === "send";
    const isStatus = type === "status";
    const messageClass = `message ${sent ? 'message-sent' : ''}`;
    const hideName = ['send', 'receive', 'typing'].includes(prevType) && prevName === userName;
    const tooltipPlacement = type === 'send' ? 'left' : type === 'receive' ? 'right' : null;

    return (
        <div>
            {isStatus ? (
                <div className="status-text">
                    <span>{msg}</span>
                </div>
            ) : (
                <div className={messageClass}>
                    {!hideName && <div className="message-sender">{userName}</div>}
                    <OverlayTrigger overlay={<Tooltip>{ts}</Tooltip>} placement={tooltipPlacement}>
                        <div className="message-content">{msg}</div>
                    </OverlayTrigger>
                </div>
            )}
        </div>
    );
}

ChatMessage.propTypes = {
    messageObj: PropTypes.object.isRequired
}

export default ChatMessage;
