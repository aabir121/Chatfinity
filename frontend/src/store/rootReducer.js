import { combineReducers } from 'redux';
import toastReducer from "../reducers/toastReducers";
import loaderReducer from "../reducers/loaderReducers";
import userListReducer from "../reducers/userListReducers";
import chatWindowReducer from "../reducers/chatWindowReducers";

const rootReducer = combineReducers({
    toast: toastReducer,
    loader: loaderReducer,
    userList: userListReducer,
    chatWindow: chatWindowReducer
});

export default rootReducer;
