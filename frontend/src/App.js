import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ChatWindow from "./components/Chat/ChatWindow";
import ToastMessage from "./components/Common/ToastMessage";
import {Spinner} from "./components/Common/Spinner";
import {useSelector} from "react-redux";
import ConfirmationModal from "./components/Common/ConfirmationDialog";
import UserProfileModal from "./components/Modal/UserProfileModal";
function App() {
    const showLoader = useSelector((state) => state.loader.showLoader);

  return (
    <div className="App">
        {showLoader && <Spinner></Spinner>}
        <ConfirmationModal />
        <UserProfileModal/>
        <ToastMessage></ToastMessage>
        <ChatWindow></ChatWindow>
    </div>
  );
}

export default App;
