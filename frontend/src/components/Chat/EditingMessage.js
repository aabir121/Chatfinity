import {Button} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import "../../styles/Chat/EditingMessage.css";

function EditingMessage({content, onEditSave, onEditCancel}) {
    const [editedContent, setEditedContent] = useState(content || '');
    const editingAreaRef = useRef(null); // Reference to the editing area

    const handleSave = () => {
        onEditSave?.(editedContent);
    };

    const handleCancel = () => {
        setEditedContent(content);
        onEditCancel?.();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editingAreaRef.current && !editingAreaRef.current.contains(event.target)) {
                handleCancel();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [content]);

    return (
        <>
            <div className="message-content editing" ref={editingAreaRef}>
                <textarea value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}/>
                <div className="edit-buttons">
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
}

export default EditingMessage;