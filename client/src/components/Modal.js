import React from 'react';
import { Modal } from 'react-bootstrap';

const UIModal = props => {
  return (
    <Modal
      {...props}
      size={props.size || 'md'}
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          {props.heading}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default UIModal;
