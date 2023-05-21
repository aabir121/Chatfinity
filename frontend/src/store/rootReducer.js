import {combineReducers} from 'redux';
import toastReducer from "../reducers/toastReducers";
import loaderReducer from "../reducers/loaderReducers";
import userListReducer from "../reducers/userListReducers";
import chatWindowReducer from "../reducers/chatWindowReducers";
import confirmModalReducer from "../reducers/confirmModalReducers";

const rootReducer = combineReducers({
    toast: toastReducer,
    loader: loaderReducer,
    userList: userListReducer,
    chatWindow: chatWindowReducer,
    confirmModal: confirmModalReducer
});

export default rootReducer;
