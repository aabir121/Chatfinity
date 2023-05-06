import {LOAD_CURRENT_USER, LOAD_USERS, SET_USER_AVAILABLE_FLAG} from "../actions/userListActions";

const initialState = {
    currentUserName: "",
    allUsers: []
};

const userListReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USERS:
            if (!action.payload || !action.payload.length) {
                return state;
            }

            const newArr = [...state.allUsers, ...action.payload];
            return {
                ...state,
                allUsers: newArr
            };
        case LOAD_CURRENT_USER:
            return {
                ...state,
                currentUserName: action.payload
            };
        case SET_USER_AVAILABLE_FLAG:
            const {userName, isOnline} = action.payload;
            const {allUsers} = state;
            const index = allUsers.findIndex(user => user.userName === userName);
            if (index === -1) {
                return state;
            }
            const updatedUser = {...allUsers[index], isOnline};
            const updatedAllUsers = [
                {...allUsers[0], isOnline: allUsers.slice(1).some(u => u.isOnline) || updatedUser.isOnline},
                ...allUsers.slice(1, index),
                updatedUser,
                ...allUsers.slice(index + 1),
            ];
            return {...state, allUsers: updatedAllUsers};
        default:
            return state;
    }
};

export default userListReducer;