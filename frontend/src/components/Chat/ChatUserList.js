import React, {useEffect, useState} from "react";
import "../../styles/Chat/ChatUserList.css";
import {UserDataService} from "../../services/UserDataService";
import {useDispatch, useSelector} from "react-redux";
import {loadUsers} from "../../actions/userListActions";

function ChatUserList() {
    const dispatch = useDispatch();
    const [allUsers, setAllUsers] = useState([]);
    const currUserName = useSelector((state) => state.userList.currentUserName);
    const userList = useSelector((state) => state.userList.allUsers);

    useEffect(() => {
        if (!currUserName) {
            return;
        }

        if (!!userList.length) {
            setAllUsers(userList);
        } else {
            UserDataService.getAllUsers()
                .then((data) => {
                    const userList = [
                        {
                            userName: "All",
                            joinTime: Date.now(),
                            isOnline: false
                        },
                        ...data.filter(u => u.userName !== currUserName)];
                    setAllUsers(userList);
                    dispatch(loadUsers(userList));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [currUserName, userList]);

    return (
        <div className="chat-user-list">
            <h2 className="user-list-header">Online Users:</h2>
            <div className="user-list">
                {allUsers.map((user, index) => (
                    <div className="user-list-item" key={index}>
                        <div className="user-list-name">{user.userName}</div>
                        <div className={`user-list-status-container ${user.isOnline ? 'online' : 'offline'}`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatUserList;