import {HIDE_USER_PROFILE_MODAL, SHOW_USER_PROFILE_MODAL} from "../actions/userProfileModalActions";

const initialState = {
    showUserProfileModal: false
};

const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_USER_PROFILE_MODAL:
            return {
                ...state, showUserProfileModal: true
            };
        case HIDE_USER_PROFILE_MODAL:
            return {
                ...state, showUserProfileModal: false
            };
        default:
            return state;
    }
};

export default loaderReducer;