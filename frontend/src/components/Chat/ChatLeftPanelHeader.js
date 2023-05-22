import "../../styles/Chat/ChatLeftPanelHeader.css";
import {FiLogOut} from 'react-icons/fi';
import {useDispatch} from "react-redux";
import {logoutCurrentUser} from "../../actions/userListActions";
import {UserDataService} from "../../services/UserDataService";
import {FaTimes} from "react-icons/fa";

function ChatLeftPanelHeader({user, toggleCollapse}) {
    const dispatch = useDispatch();
    const fullName = `${user.firstName} ${user.lastName}`;

    const logout = () => {
        UserDataService.logoutUser(user.userName)
            .then(() => {
                dispatch(logoutCurrentUser(user));
            });
    };

    return (
        <div className="left-panel-header">
            <div className="avatar"></div>
            <div className="user-info">
                <div className="full-name">{fullName}</div>
                {user && user.userName && <FiLogOut title="Logout" className="logout-btn" onClick={logout}></FiLogOut>}
                <div className="close-icon" onClick={toggleCollapse}><FaTimes/></div>
            </div>
        </div>
    );
}

export default ChatLeftPanelHeader;