import React, {useEffect, useState} from "react";
import "../../styles/Chat/ChatUserList.css";
import ChatUserCard from "./ChatUserCard";

function ChatUserList({allUsers, onUserClick}) {
    const [onlineCountText, setOnlineCountText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const onlineCount = allUsers.slice(1).filter(u => u.isOnline).length;
        setOnlineCountText(`${onlineCount}/${Math.max(allUsers.length - 1, 0)}`);
    }, [allUsers]);

    const onSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredList = allUsers.filter(u => !searchQuery || u.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="user-list">
            <div className="search-bar">
                <input type="text" onChange={onSearchChange} value={searchQuery} placeholder="Search for users..."/>
            </div>
            <div className="online-count">
                <span className="count">{onlineCountText}</span> Users online
            </div>
            <ul>
                {filteredList.map((user, index) => (
                    <ChatUserCard key={index} user={user} index={index} onItemClick={onUserClick}></ChatUserCard>
                ))}
            </ul>
        </div>
    );
}

export default ChatUserList;
