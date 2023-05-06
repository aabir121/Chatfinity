import { combineReducers } from 'redux';
import toastReducer from "../reducers/toastReducers";

const rootReducer = combineReducers({
    toast: toastReducer,
});

export default rootReducer;
