import React, {useRef, useState, useEffect} from 'react';
import '../../styles/Chat/ChatMessage.css';
import {formatChatTimestamp} from './Utils';
import {useDispatch, useSelector} from 'react-redux';
import {PulseLoader} from 'react-spinners';
import {Button, ButtonGroup, OverlayTrigger, Popover} from 'react-bootstrap';
import {FaEdit, FaTrash} from 'react-icons/fa';
import {openModal} from '../../actions/confirmModalActions';
import StatusMessage from "./StatusMessage";

function ChatMessage({messageObj, prevMessageObj, onEdit, onDelete}) {
    const currUserName = useSelector((state) => state.userList.currentUser?.userName);
    const {id, sender, content, type, timestamp, isPending} = messageObj;
    const {sender: prevSender, type: prevType} = prevMessageObj || {};
    const sent = type === 'message' && currUserName === sender;
    const isStatus = type === 'status';
    const messageClass = `message ${sent ? 'message-sent' : ''}`;
    const hideName = ['message', 'typing'].includes(prevType) && prevSender === sender;
    const containerRef = useRef(null);
    const editingAreaRef = useRef(null); // Reference to the editing area
    const [showMsgInfo, setShowMsgInfo] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);
    const isTypingContent = <PulseLoader size={10}/>;
    const isPendingClass = isPending ? 'pending' : '';
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

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

    useEffect(() => {
        // Add event listener to handle outside clicks when editing
        const handleClickOutside = (event) => {
            if (editing && editingAreaRef.current && !editingAreaRef.current.contains(event.target)) {
                setEditedContent(content); // Revert back to the original content
                setEditing(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [editing, content]);

    const handleConfirmation = (onConfirm) => {
        dispatch(
            openModal({
                title: 'Delete Message',
                body: 'Are you sure you want to delete this message?',
                positiveAction: onConfirm,
                negativeAction: () => {
                },
                positiveButtonTitle: 'Delete',
                negativeButtonTitle: 'Cancel',
            })
        );
    };

    const handleEdit = (e) => {
        setEditing(true);
        e.stopPropagation();
    };

    const handleDelete = () => {
        handleConfirmation(() => {
            onDelete?.(id);
        });
    };

    const handleSave = () => {
        onEdit?.(id, editedContent);
        setEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(content);
        setEditing(false);
    };

    const popover = (
        <Popover id={`message-options-popover-${id}`}>
            <Popover.Body id={`message-options-popover-content-${id}`}>
                <ButtonGroup vertical>
                    <Button variant="light" onClick={handleEdit}>
                        <FaEdit/>
                    </Button>
                    <Button variant="light" onClick={handleDelete}>
                        <FaTrash/>
                    </Button>
                </ButtonGroup>
            </Popover.Body>
        </Popover>
    );

    if (isStatus) {
        return <StatusMessage content={content}></StatusMessage>;
    }

    return (
        <div ref={containerRef} key={id}>
            <div className={messageClass}>
                {!hideName && <div className="message-sender">{sender}</div>}
                {editing ? (
                    <div className="message-content editing" ref={editingAreaRef}>
                        <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)}/>
                        <div className="edit-buttons">
                            <Button variant="success" onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`message-content ${isPendingClass}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {sent ? (
                            <OverlayTrigger
                                trigger="click"
                                placement="auto"
                                overlay={popover}
                                rootClose
                                container={containerRef.current}
                            >
                                <span>{type === 'typing' ? isTypingContent : content}</span>
                            </OverlayTrigger>
                        ) : (
                            <span>{type === 'typing' ? isTypingContent : content}</span>
                        )}
                    </div>
                )}
                {showMsgInfo && <span className="info">{formatChatTimestamp(timestamp)}</span>}
            </div>
        </div>
    );
}

export default ChatMessage;
