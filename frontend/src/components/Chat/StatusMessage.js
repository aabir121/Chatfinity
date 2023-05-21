import React from "react";
import "../../styles/Chat/StatusMessage.css";
function StatusMessage({content}) {
    return (
        <div className="status-text">
            <span>{content}</span>
        </div>
    )
}

export default StatusMessage;