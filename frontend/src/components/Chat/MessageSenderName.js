import React from "react";
import "../../styles/Chat/MessageSenderName.css";

function MessageSenderName({sender, prevMessageObj}) {
    const {sender: prevSender, type: prevType} = prevMessageObj || {};
    const hideName = ['message', 'typing'].includes(prevType) && prevSender === sender;

    return (
        <>
            {!hideName && <div className="message-sender">{sender}</div>}
        </>
    );
}

export default MessageSenderName;