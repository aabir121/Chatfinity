import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Chat/ChatInput.css';

function ChatInput(props) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    let timeoutId;
    const handleKeyPress = (event) => {
        if (event.keyCode === 13) {
            sendMessage();
        } else {
            handleTyping();
        }
    };

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            props.setTypingStatus(true);
        }

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            setIsTyping(false);
            props.setTypingStatus(false);
        }, 3000);
    }

    const sendMessage = () => {
        if (message.trim() === '') {
            return;
        }

        setIsTyping(false);
        props.setTypingStatus(false);

        setTimeout(()=>{
            props.sendMessage(message.trim());
            setMessage('');
        });
    }

    return (
        <div className="chat-input">
            <input type="text" placeholder="Type your message..." onKeyDown={handleKeyPress}
                   value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage} className="send-button">Send</button>
        </div>
    );
}

ChatInput.propTypes = {
    sendMessage: PropTypes.func.isRequired,
};

export default ChatInput;
