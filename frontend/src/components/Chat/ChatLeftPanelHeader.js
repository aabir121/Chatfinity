import "../../styles/Chat/ChatLeftPanelHeader.css";
import {FiLogOut} from 'react-icons/fi';
import {useDispatch} from "react-redux";
import {logoutCurrentUser} from "../../actions/userListActions";
import {UserDataService} from "../../services/UserDataService";
import {FaTimes} from "react-icons/fa";
import React from "react";
import UserAvatar from "../Common/UserAvatar";
import {showUserProfileModal} from "../../actions/userProfileModalActions";

function ChatLeftPanelHeader({user, toggleCollapse}) {
    const dispatch = useDispatch();
    const fullName = `${user.firstName} ${user.lastName}`;

    const logout = () => {
        UserDataService.logoutUser(user.userName)
            .then(() => {
                dispatch(logoutCurrentUser(user));
            });
    };

    const onUserNameClick = () => {
      dispatch(showUserProfileModal());
    };

    return (
        <div className="left-panel-header">
            <UserAvatar avatarStr={user.avatar}/>
            <div className="user-info">
                <div className="full-name" onClick={onUserNameClick}>{fullName}</div>
                {user && user.userName && <FiLogOut title="Logout" className="logout-btn" onClick={logout}></FiLogOut>}
                <div className="close-icon" onClick={toggleCollapse}><FaTimes/></div>
            </div>
        </div>
    );
}

export default ChatLeftPanelHeader;