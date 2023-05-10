export const SET_CHAT_WINDOW_PARAMS = "SET_CHAT_WINDOW_PARAMS";

export const setChatWindowParams = (chatType, participants) => {
    return {
        type: SET_CHAT_WINDOW_PARAMS, payload: {chatType, participants}
    }
};