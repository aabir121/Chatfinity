import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ChatWindow from "./components/Chat/ChatWindow";
import ToastMessage from "./components/Common/ToastMessage";
function App() {
  return (
    <div className="App">
        <ToastMessage></ToastMessage>
        <ChatWindow></ChatWindow>
    </div>
  );
}

export default App;
