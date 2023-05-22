import React, {useEffect, useState} from "react";
import "../../styles/Chat/ChatLeftPanel.css";
import {UserDataService} from "../../services/UserDataService";
import {useDispatch, useSelector} from "react-redux";
import {loadUsers} from "../../actions/userListActions";
import {setChatWindowParams} from "../../actions/chatWindowActions";
import ChatLeftPanelHeader from "./ChatLeftPanelHeader";
import ChatUserList from "./ChatUserList";
import {FaBars} from "react-icons/fa";

function ChatLeftPanel() {
    const dispatch = useDispatch();
    const [allUsers, setAllUsers] = useState([]);
    const currentUser = useSelector((state) => state.userList.currentUser);
    const userList = useSelector((state) => state.userList.allUsers);
    const {chatType} = useSelector(state => ({
        chatType: state.chatWindow.chatType
    }));
    const [showSidePanel, setShowSidePanel] = useState(true);

    const handleToggle = () => {
        setShowSidePanel(!showSidePanel);
    };

    useEffect(() => {
        if (!currentUser || !currentUser?.userName) {
            setAllUsers([]);
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
                            fullName: "General Chat",
                            isOnline: false,
                            isSelected: true
                        },
                        ...data.filter(u => u.userName !== currentUser.userName)];
                    setAllUsers(userList);
                    dispatch(loadUsers(userList));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [currentUser, userList]);

    const onUserClick = (currIdx) => {
        const copyList = [...allUsers];
        const prevSelectedIdx = copyList.findIndex(u => u.isSelected)
        if (prevSelectedIdx === currIdx) {
            return;
        }

        copyList[prevSelectedIdx].isSelected = false;
        copyList[currIdx].isSelected = true;
        setAllUsers([...copyList]);

        const newType = chatType === "private" && currIdx === 0 ? "public" : "private";
        const participants = [currentUser.userName, copyList[currIdx].userName];
        dispatch(setChatWindowParams(newType, participants));
    };

    if (!showSidePanel) {
        return (
            <div className={`side-panel-toggle`} onClick={handleToggle}>
                <div className="hamburger-icon">
                    <FaBars/>
                </div>
            </div>
        );
    }

    return (
        <div className={`chat-left-panel ${showSidePanel ? 'expanded' : ''}`}>
            <ChatLeftPanelHeader user={currentUser} toggleCollapse={handleToggle}></ChatLeftPanelHeader>
            <ChatUserList allUsers={allUsers} onUserClick={onUserClick}></ChatUserList>
        </div>
    );
}

export default ChatLeftPanel;