import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';

import {closeModal} from "../../actions/confirmModalActions";

const ConfirmationModal = () => {
    const {
        show,
        title = 'Confirmation',
        body = 'Are you sure?',
        positiveAction = () => {
        },
        negativeAction = () => {
        },
        positiveButtonTitle = 'Confirm',
        negativeButtonTitle = 'Cancel',
    } = useSelector(state => state.confirmModal);
    const dispatch = useDispatch();
    const handlePositiveAction = () => {
        try {
            positiveAction();
            dispatch(closeModal());
        } catch (error) {
            console.log('Positive action error:', error);
        }
    };

    const handleNegativeAction = () => {
        try {
            negativeAction();
            dispatch(closeModal());
        } catch (error) {
            console.log('Negative action error:', error);
        }
    };

    return (
        <Modal animation={false} show={show} onHide={closeModal} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleNegativeAction}>
                    {negativeButtonTitle}
                </Button>
                <Button variant="primary" onClick={handlePositiveAction}>
                    {positiveButtonTitle}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
