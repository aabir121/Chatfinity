import * as signalR from "@microsoft/signalr";
import SignalRFunctionNames from "./SignalRFunctionNames";

class _ChatService {
    connection = null;
    onReceiveMessage = null;
    onAnnounceUser = null;
    onConnected = null;
    onSendMessage = null;
    onGetAllUsers = null;
    onTypingStatus = null;

    initialize = (userName) => {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5095/chatHub?user=" + userName)
            .withAutomaticReconnect()
            .build();

        this.connection.on(SignalRFunctionNames.RECEIVE_MSG, (user, msg) => {
            this.onReceiveMessage?.(user, msg);
        });

        this.connection.on(SignalRFunctionNames.ANNOUNCE_USER, (user, joined) => {
            this.onAnnounceUser?.(user, joined);
        });

        this.connection.on(SignalRFunctionNames.GET_ALL_USERS, (users) => {
            this.onGetAllUsers?.(users);
        });

        this.connection.on(SignalRFunctionNames.TYPING_STATUS, (user, isTyping) => {
            this.onTypingStatus?.(user, isTyping);
        });
    }

    start = (userName) => {
        if (this.connection) {
            return this.connection.start()
                .then(() => {
                    console.log("SignalR Connected");
                    this.onConnected?.();
                })
                .catch((err) => {
                    console.log("SignalR Failed", err);
                });
        } else {
            this.initialize(userName);
            return this.start(userName);
        }
    }

    stop = () => {
        this.connection?.stop();
    }

    setReceiveMessageHandler = (handler) => {
        this.onReceiveMessage = handler;
    }

    setAnnounceUserHandler = (handler) => {
        this.onAnnounceUser = handler;
    }

    setSendMessageHandler = (handler) => {
        this.onSendMessage = handler;
    }

    setOnTypingStatusHandler = (handler) => {
        this.onTypingStatus = handler;
    }

    invoke = (functionName, callback, ...args) => {
        this.connection?.invoke(functionName, ...args)
            .then(() => {
                callback?.(...args);
            })
            .catch((err) => {
                console.log("SignalR Invocation Error", err);
            });
    }

    sendMessage = (user, message) => {
        this.invoke(SignalRFunctionNames.SEND_MESSAGE, this.onSendMessage, user, message);
    }

    sendTypingStatus = (user, isTyping) => {
        this.invoke(SignalRFunctionNames.TYPING_STATUS, null, user, isTyping);
    }
}

const ChatService = new _ChatService();
export default ChatService;
