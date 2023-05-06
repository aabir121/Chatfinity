import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ChatWindow from "./components/Chat/ChatWindow";
import ToastMessage from "./components/Common/ToastMessage";
import {Spinner} from "./components/Common/Spinner";
import {useSelector} from "react-redux";
function App() {
    const showLoader = useSelector((state) => state.loader.showLoader);

  return (
    <div className="App">
        {showLoader && <Spinner></Spinner>}
        <ToastMessage></ToastMessage>
        <ChatWindow></ChatWindow>
    </div>
  );
}

export default App;
