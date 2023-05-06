import {HIDE_TOAST, SHOW_TOAST} from '../actions/toastActions';

const initialState = {
    toast: {
        id: '',
        show: false,
        autoDismiss: true,
        title: '',
        message: ''
    },
    toastArray: []
};

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_TOAST:
            const newToast = {
                ...state.toast,
                id: action.payload.id,
                show: true,
                autoDismiss: action.payload.autoDismiss,
                title: action.payload.title,
                message: action.payload.message
            };

            return {
                ...state,
                toastArray: [...state.toastArray, newToast]
            };
        case HIDE_TOAST:
            return {
                ...state,
                toastArray: state.toastArray.filter(toast => toast.id !== action.payload.id)
            };
        default:
            return state;
    }
};

export default toastReducer;
