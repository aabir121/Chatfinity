export const OPEN_CONFIRM_MODAL = 'OPEN_CONFIRM_MODAL';
export const CLOSE_CONFIRM_MODAL = 'CLOSE_CONFIRM_MODAL';

export const openModal = ({
                              title,
                              body,
                              positiveAction,
                              negativeAction,
                              positiveButtonTitle,
                              negativeButtonTitle,
                          }) => ({
    type: OPEN_CONFIRM_MODAL,
    payload: {
        title,
        body,
        positiveAction,
        negativeAction,
        positiveButtonTitle,
        negativeButtonTitle,
    },
});

export const closeModal = () => ({
    type: CLOSE_CONFIRM_MODAL,
});
