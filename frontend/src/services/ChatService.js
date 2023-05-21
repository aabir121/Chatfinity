import * as signalR from "@microsoft/signalr";
import SignalRFunctionNames from "./SignalRFunctionNames";

class _ChatService {
    connection = null;
    onReceiveMessage = null;
    onAnnounceUser = null;
    onConnected = null;
    onSendMessage = null;
    onTypingStatus = null;
    isConnected = false;
    onMessageDeleted = null;
    onMessageUpdated = null;

    initialize = (userName) => {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5095/chatHub?user=" + userName)
            .withAutomaticReconnect()
            .build();

        this.connection.on(SignalRFunctionNames.RECEIVE_MSG, (message) => {
            this.onReceiveMessage?.(message);
        });

        this.connection.on(SignalRFunctionNames.ANNOUNCE_USER, (userName, joined) => {
            this.onAnnounceUser?.(userName, joined);
        });

        this.connection.on(SignalRFunctionNames.TYPING_STATUS, (user, type, participants, isTyping) => {
            this.onTypingStatus?.(user, type, participants, isTyping);
        });

        this.connection.on(SignalRFunctionNames.MESSAGE_DELETED, (chatId, messageId) => {
            this.onMessageDeleted?.(chatId, messageId);
        });

        this.connection.on(SignalRFunctionNames.MESSAGE_UPDATED, (updatedMsg) => {
            this.onMessageUpdated?.(updatedMsg);
        });

        this.connection.onclose(() => {
            this.isConnected = false;
        });
    }

    start = (userName) => {
        if (this.connection) {
            return this.connection.start()
                .then(() => {
                    console.log("SignalR Connected");
                    this.isConnected = true;
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
        this.isConnected = false;
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

    setOnMessageDeletedHandler = (handler) => {
        this.onMessageDeleted = handler;
    }

    setOnMessageUpdatedHandler = (handler) => {
        this.onMessageUpdated = handler;
    }

    invoke = (functionName, callback, ...args) => {
        if (this.isConnected) {
            this.connection?.invoke(functionName, ...args)
                .then(() => {
                    callback?.(...args);
                })
                .catch((err) => {
                    console.log("SignalR Invocation Error", err);
                });
        }
    }

    sendMessage = (msgBody) => {
        this.invoke(SignalRFunctionNames.SEND_MESSAGE, this.onSendMessage, msgBody);
    }

    sendTypingStatus = (user, type, participants, isTyping) => {
        this.invoke(SignalRFunctionNames.TYPING_STATUS, null, user, type, participants, isTyping);
    }

    deleteMessage = (chatId, messageId) => {
        this.invoke(SignalRFunctionNames.DELETE_MESSAGE, null, chatId, messageId);
    };

    updateMessage = (chatId, messageId, content) => {
        this.invoke(SignalRFunctionNames.UPDATE_MESSAGE, null, chatId, messageId, content);
    };
}

const ChatService = new _ChatService();
export default ChatService;
