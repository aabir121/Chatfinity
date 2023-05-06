import { combineReducers } from 'redux';
import toastReducer from "../reducers/toastReducers";
import loaderReducer from "../reducers/loaderReducers";
import userListReducer from "../reducers/userListReducers";

const rootReducer = combineReducers({
    toast: toastReducer,
    loader: loaderReducer,
    userList: userListReducer
});

export default rootReducer;
