import React, {useRef} from 'react';
import PropTypes from "prop-types";
import "../../styles/Chat/ChatMessage.css";
import {Tooltip, OverlayTrigger} from "react-bootstrap";
import {formatChatTimestamp} from "./Utils";
import {useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";

function ChatMessage({messageObj, prevMessageObj}) {
    const currUserName = useSelector((state)=>state.userList.currentUserName);
    const {sender, content, type, timestamp} = messageObj;
    const {sender: prevSender, type: prevType} = prevMessageObj || {};
    const sent = type === "message" && currUserName === sender;
    const isStatus = type === "status";
    const messageClass = `message ${sent ? 'message-sent' : ''}`;
    const hideName = ['message', 'typing'].includes(prevType) && prevSender === sender;
    const containerRef = useRef(null);
    const tooltipContent = <Tooltip>{formatChatTimestamp(timestamp)}</Tooltip>;
    const isTypingContent = <PulseLoader size={10} />;

    return (
        <div ref={containerRef}>
            {isStatus ? (
                <div className="status-text">
                    <span>{content}</span>
                </div>
            ) : (
                <div className={messageClass}>
                    {!hideName && <div className="message-sender">{sender}</div>}
                    <OverlayTrigger container={containerRef} delay={{show: 500, hide: 400}}
                                    overlay={tooltipContent}
                                    placement="auto">
                        <div className="message-content">{type === 'typing' ? isTypingContent : content}</div>
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
