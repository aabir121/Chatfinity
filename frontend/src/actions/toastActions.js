export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';

export const showToast = (title, message, autoDismiss = true) => ({
    type: SHOW_TOAST,
    payload: {id: Date.now(), title, message, autoDismiss},
});

export const hideToast = (id) => ({
    type: HIDE_TOAST,
    payload: {id}
});