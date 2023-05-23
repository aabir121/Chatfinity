import Base64Image from "./Base64Image";
import "../../styles/common/UserAvatar.css";

function UserAvatar({avatarStr}) {
    return (
      <div className="user-avatar">
          <Base64Image base64String={avatarStr}/>
      </div>
    );
}

export default UserAvatar;