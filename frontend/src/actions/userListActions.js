export const LOAD_USERS = 'LOAD_USERS';
export const SET_USER_AVAILABLE_FLAG = 'SET_USER_AVAILABLE_FLAG';

export const LOAD_CURRENT_USER = 'LOAD_CURRENT_USER';

export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';

export const loadUsers = (allUsers) => ({
    type: LOAD_USERS,
    payload: allUsers,
});

export const setUserAvailableFLag = (userName, isOnline) => ({
    type: SET_USER_AVAILABLE_FLAG,
    payload: {userName, isOnline}
});

export const loadCurrentUser = (currUser) => ({
    type: LOAD_CURRENT_USER,
    payload: currUser
});

export const logoutCurrentUser = (user) => ({
    type: LOGOUT_CURRENT_USER,
    payload: user
})