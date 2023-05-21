import React, {useRef, useState, useEffect} from 'react';
import '../../styles/Chat/ChatMessage.css';
import {useSelector} from 'react-redux';
import StatusMessage from "./StatusMessage";
import EditingMessage from "./EditingMessage";
import RegularMessage from "./RegularMessage";
import MessageSenderName from "./MessageSenderName";

function ChatMessage({messageObj, prevMessageObj, onEdit, onDelete}) {
    const currUserName = useSelector((state) => state.userList.currentUser?.userName);
    const {id, sender, content, type} = messageObj;
    const sent = type === 'message' && currUserName === sender;
    const messageClass = `message ${sent ? 'message-sent' : ''}`;

    const [editing, setEditing] = useState(false);

    const openEditMode = () => {
        setEditing(true);
    };

    const deleteMessage = () => {
        onDelete?.(id);
    };

    const handleEditedContentSave = (editedContent) => {
        onEdit?.(id, editedContent);
        setEditing(false);
    };

    const handleEditContentCancel = () => {
        setEditing(false);
    };

    if (type === 'status') {
        return <StatusMessage key={id} content={content}></StatusMessage>;
    }

    if (editing) {
        return (
            <div key={id} className={messageClass}>
                <MessageSenderName sender={sender} prevMessageObj={prevMessageObj}/>
                <EditingMessage content={content} onEditSave={handleEditedContentSave}
                                onEditCancel={handleEditContentCancel}/>
            </div>
        );
    }

    return (
        <div key={id} className={messageClass}>
            <MessageSenderName sender={sender} prevMessageObj={prevMessageObj}/>
            <RegularMessage sent={sent} messageObj={messageObj}
                            handleMessageEditClick={openEditMode}
                            handleMessageDeleteConfirm={deleteMessage}/>
        </div>
    );
}

export default ChatMessage;
