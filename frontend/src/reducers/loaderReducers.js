import {HIDE_LOADER, SHOW_LOADER} from "../actions/loaderActions";

const initialState = {
    showLoader: false
};

const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_LOADER:
            return {
                ...state, showLoader: true
            };
        case HIDE_LOADER:
            return {
                ...state, showLoader: false
            };
        default:
            return state;
    }
};

export default loaderReducer;