import {LOAD_USERS, SET_USER_AVAILABLE_FLAG} from "../actions/userListActions";

const initialState = {
    allUsers: [
        {
            connectionId: Date.now(),
            userName: "All",
            joinTime: Date.now(),
            isOnline: false
        }
    ]
};

const userListReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USERS:
            return {
                ...state,
                allUsers: !action.payload || !action.payload.length ?
                    [...state.allUsers] : [...state.allUsers, action.payload]
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
                {...allUsers[0], isOnline: allUsers.slice(1).some(u => u.isOnline)},
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