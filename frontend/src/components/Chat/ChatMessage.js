import React, {useRef, useState, useEffect} from 'react';
import '../../styles/Chat/ChatMessage.css';
import {formatChatTimestamp} from './Utils';
import {useDispatch, useSelector} from 'react-redux';
import {PulseLoader} from 'react-spinners';
import {Button, ButtonGroup, OverlayTrigger, Popover} from 'react-bootstrap';
import {FaEdit, FaTrash} from 'react-icons/fa';
import {openModal} from '../../actions/confirmModalActions';
import StatusMessage from "./StatusMessage";
import EditingMessage from "./EditingMessage";

function ChatMessage({messageObj, prevMessageObj, onEdit, onDelete}) {
    const currUserName = useSelector((state) => state.userList.currentUser?.userName);
    const {id, sender, content, type, timestamp, isPending} = messageObj;
    const {sender: prevSender, type: prevType} = prevMessageObj || {};
    const sent = type === 'message' && currUserName === sender;
    const isStatus = type === 'status';
    const messageClass = `message ${sent ? 'message-sent' : ''}`;
    const hideName = ['message', 'typing'].includes(prevType) && prevSender === sender;
    const containerRef = useRef(null);
    const [showMsgInfo, setShowMsgInfo] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);
    const isTypingContent = <PulseLoader size={10}/>;
    const isPendingClass = isPending ? 'pending' : '';
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);

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

    const handleEditedContentSave = (editedContent) => {
        onEdit?.(id, editedContent);
        setEditing(false);
    };

    const handleEditContentCancel = () => {
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
                    <EditingMessage content={content} onEditSave={handleEditedContentSave} onEditCancel={handleEditContentCancel}/>
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
