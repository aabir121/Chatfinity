import {LOAD_CURRENT_USER, LOAD_USERS, LOGOUT_CURRENT_USER, SET_USER_AVAILABLE_FLAG} from "../actions/userListActions";

const initialState = {
    currentUser: {
        id: "",
        userName: "",
        firstName: "",
        lastName: "",
        dob: new Date(),
        avatar: ""
    },
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
                currentUser: action.payload
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
                ...allUsers.slice(0, index),
                updatedUser,
                ...allUsers.slice(index + 1),
            ];
            const isAnyoneOnline = updatedAllUsers.slice(1).some(u => u.isOnline);
            const updatedAllUserItem = {...updatedAllUsers[0], isOnline: isAnyoneOnline};

            return {...state, allUsers: [updatedAllUserItem, ...updatedAllUsers.slice(1)]};
        case LOGOUT_CURRENT_USER:
            return {
                ...state,
                currentUser: {
                    id: "",
                    userName: "",
                    firstName: "",
                    lastName: "",
                    dob: new Date(),
                    avatar: ""
                },
                allUsers: []
            }
        default:
            return state;
    }
};

export default userListReducer;