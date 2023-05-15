import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Chat/ChatMessage.css';
import { formatChatTimestamp } from './Utils';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';

function ChatMessage({ messageObj, prevMessageObj }) {
    const currUserName = useSelector((state) => state.userList.currentUser?.userName);
    const { id, sender, content, type, timestamp, isPending } = messageObj;
    const { sender: prevSender, type: prevType } = prevMessageObj || {};
    const sent = type === 'message' && currUserName === sender;
    const isStatus = type === 'status';
    const messageClass = `message ${sent ? 'message-sent' : ''}`;
    const hideName = ['message', 'typing'].includes(prevType) && prevSender === sender;
    const containerRef = useRef(null);
    const [showMsgInfo, setShowMsgInfo] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);
    const isTypingContent = <PulseLoader size={10} />;
    const isPendingClass = isPending ? 'pending' : '';

    const handleMouseEnter = () => {
        const timer = setTimeout(() => {
            setShowMsgInfo(true);
        }, 500);
        setHoverTimer(timer);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimer);
        setShowMsgInfo(false);
    };

    useEffect(() => {
        return () => {
            clearTimeout(hoverTimer);
        };
    }, [hoverTimer]);

    return (
        <div ref={containerRef} key={id}>
            {isStatus ? (
                <div className="status-text">
                    <span>{content}</span>
                </div>
            ) : (
                <div className={messageClass}>
                    {!hideName && <div className="message-sender">{sender}</div>}
                    <div
                        className={`message-content ${isPendingClass}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {type === 'typing' ? isTypingContent : content}
                    </div>
                    {showMsgInfo && <span className="info">{formatChatTimestamp(timestamp)}</span>}
                </div>
            )}
        </div>
    );
}

ChatMessage.propTypes = {
    messageObj: PropTypes.object.isRequired,
};

export default ChatMessage;
