import React, {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import "../../styles/Chat/ChatMessage.css";
import {Tooltip, OverlayTrigger} from "react-bootstrap";
import {formatChatTimestamp} from "./Utils";

function ChatMessage({messageObj, prevMessageObj}) {
    const {userName, msg, type, ts} = messageObj;
    const {userName: prevName, type: prevType} = prevMessageObj || {};
    const sent = type === "send";
    const isStatus = type === "status";
    const messageClass = `message ${sent ? 'message-sent' : ''}`;
    const hideName = ['send', 'receive', 'typing'].includes(prevType) && prevName === userName;
    const containerRef = useRef(null);
    const tooltipContent = <Tooltip>{formatChatTimestamp(ts)}</Tooltip>;

    return (
        <div ref={containerRef}>
            {isStatus ? (
                <div className="status-text">
                    <span>{msg}</span>
                </div>
            ) : (
                <div className={messageClass}>
                    {!hideName && <div className="message-sender">{userName}</div>}
                    <OverlayTrigger container={containerRef} delay={{show: 500, hide: 400}}
                                    overlay={tooltipContent}
                                    placement="auto" defaultShow={false}>
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
