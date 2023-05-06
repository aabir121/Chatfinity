import Toast from 'react-bootstrap/Toast';
import {useDispatch, useSelector} from "react-redux";

import {ToastContainer} from "react-bootstrap";
import {hideToast} from "../../actions/toastActions";

const ToastMessage = () => {
    const dispatch = useDispatch();
    const toastArray = useSelector((state) => state.toast.toastArray);

    return (
        <ToastContainer position="top-end" className="p-3">
            {toastArray.map((toast) => (
                <Toast key={toast.id} show={toast.show}
                       onClose={() => dispatch(hideToast(toast.id))}
                       delay={3000} autohide={toast.autoDismiss}>
                    <Toast.Header>
                        <strong className="me-auto">{toast.title || 'Notification'}</strong>
                    </Toast.Header>
                    <Toast.Body>{toast.message || 'This is a notification'}</Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}

export default ToastMessage;