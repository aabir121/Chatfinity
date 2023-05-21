import {useEffect, useState} from "react";
import {Button, ButtonGroup, OverlayTrigger, Popover} from "react-bootstrap";
import {PulseLoader} from "react-spinners";
import {FaEdit, FaTrash} from "react-icons/fa";
import {openModal} from "../../actions/confirmModalActions";
import {useDispatch} from "react-redux";
import {formatChatTimestamp} from "./Utils";

import "../../styles/Chat/RegularMessage.css";

function RegularMessage({messageObj, sent, handleMessageEditClick, handleMessageDeleteConfirm}) {
    const {id, isPending, type, content, timestamp, isUpdated} = messageObj;
    const isPendingClass = isPending ? "pending" : "";
    const isTypingContent = <PulseLoader size={10}/>;
    const dispatch = useDispatch();

    const [showMsgInfo, setShowMsgInfo] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);

    const handleConfirmation = (onConfirm) => {
        dispatch(
            openModal({
                title: "Delete Message",
                body: "Are you sure you want to delete this message?",
                positiveAction: onConfirm,
                negativeAction: () => {
                },
                positiveButtonTitle: "Delete",
                negativeButtonTitle: "Cancel",
            })
        );
    };

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

    const onMessageEditClick = (e) => {
        handleMessageEditClick?.();
        e.stopPropagation();
    };

    const onMessageDeleteClick = () => {
        handleConfirmation(() => {
            handleMessageDeleteConfirm?.();
        });
    };

    const optionsPopover = (
        <Popover id={`message-options-popover-${id}`}>
            <Popover.Body id={`message-options-popover-content-${id}`}>
                <ButtonGroup vertical>
                    <Button variant="light" onClick={onMessageEditClick}>
                        <FaEdit/>
                    </Button>
                    <Button variant="light" onClick={onMessageDeleteClick}>
                        <FaTrash/>
                    </Button>
                </ButtonGroup>
            </Popover.Body>
        </Popover>
    );

    useEffect(() => {
        return () => {
            clearTimeout(hoverTimer);
        };
    }, [hoverTimer]);

    return (
        <>
            <div
                className={`message-content ${isPendingClass} ${isUpdated ? "updated" : ""}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {sent ? (
                    <OverlayTrigger trigger="click" placement="auto" overlay={optionsPopover} rootClose>
                        <span>{type === "typing" ? isTypingContent : content}</span>
                    </OverlayTrigger>
                ) : (
                    <span>{type === "typing" ? isTypingContent : content}</span>
                )}
            </div>
            {showMsgInfo && <span className="info">{formatChatTimestamp(timestamp)}</span>}
        </>
    );
}

export default RegularMessage;
