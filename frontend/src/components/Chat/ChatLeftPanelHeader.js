import "../../styles/Chat/ChatLeftPanelHeader.css";
import {FiLogOut} from 'react-icons/fi';
import {useDispatch} from "react-redux";
import {logoutCurrentUser} from "../../actions/userListActions";

function ChatLeftPanelHeader({user}) {
    const dispatch = useDispatch();
    const fullName = `${user.firstName} ${user.lastName}`;

    const logout = () => {
        dispatch(logoutCurrentUser(user));
    };

    return (
        <div className="left-panel-header">
            <div className="avatar"></div>
            <div className="user-info">
                <div className="full-name">{fullName}</div>
                {user && user.userName && <FiLogOut title="Logout" className="logout-btn" onClick={logout}></FiLogOut>}
            </div>
        </div>
    );
}

export default ChatLeftPanelHeader;