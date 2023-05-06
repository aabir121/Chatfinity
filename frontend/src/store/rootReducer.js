import { combineReducers } from 'redux';
import toastReducer from "../reducers/toastReducers";
import loaderReducer from "../reducers/loaderReducers";

const rootReducer = combineReducers({
    toast: toastReducer,
    loader: loaderReducer
});

export default rootReducer;
