export const SHOW_USER_PROFILE_MODAL = 'SHOW_USER_PROFILE_MODAL';
export const HIDE_USER_PROFILE_MODAL = 'HIDE_USER_PROFILE_MODAL';

export const showUserProfileModal = () => ({
    type: SHOW_USER_PROFILE_MODAL,
});

export const hideUserProfileModal = () => ({
    type: HIDE_USER_PROFILE_MODAL,
});