import {SET_CHAT_WINDOW_PARAMS} from "../actions/chatWindowActions";

const initialState = {
    participants: [],
    chatType: "public",
};

const chatWindowReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHAT_WINDOW_PARAMS:
            return {
                ...state,
                chatType: action.payload.chatType,
                participants: action.payload.participants
            };
        default:
            return state;
    }
};

export default chatWindowReducer;