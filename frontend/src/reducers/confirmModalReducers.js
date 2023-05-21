import {CLOSE_CONFIRM_MODAL, OPEN_CONFIRM_MODAL} from "../actions/confirmModalActions";

const initialState = {
    show: false,
    title: 'Confirmation',
    body: 'Are you sure?',
    positiveAction: () => Promise.resolve(),
    negativeAction: () => Promise.reject(),
    positiveButtonTitle: 'Confirm',
    negativeButtonTitle: 'Cancel',
};

const confirmModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_CONFIRM_MODAL:
            return {
                ...state,
                show: true,
                title: action.payload.title || initialState.title,
                body: action.payload.body || initialState.body,
                positiveAction: action.payload.positiveAction || initialState.positiveAction,
                negativeAction: action.payload.negativeAction || initialState.negativeAction,
                positiveButtonTitle:
                    action.payload.positiveButtonTitle || initialState.positiveButtonTitle,
                negativeButtonTitle:
                    action.payload.negativeButtonTitle || initialState.negativeButtonTitle,
            };
        case CLOSE_CONFIRM_MODAL:
            return {
                ...state,
                show: false,
            };
        default:
            return state;
    }
};

export default confirmModalReducer;
