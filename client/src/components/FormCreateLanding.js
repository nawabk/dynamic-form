import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

import Modal from './Modal';
import { BASE_URL } from '../utils/shared';
import BuildFormLanding from './BuildFormLanding';

const FormCreateLanding = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getCurrentForm() {
      try {
        const res = await axios.get(`${BASE_URL}/api/forms/getCurrent`);
        setForm(res.data[0]);
      } catch (err) {}
    }
    getCurrentForm();
  }, []);

  const createFormHandler = async body => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/forms`, body);
      setForm(res.data);
      setLoading(false);
      setShowModal(false);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        heading='Create Form'
      >
        <FormInput createFormHandler={createFormHandler} loading={loading} />
      </Modal>
      {!form ? (
        <div
          style={{ height: '40vh' }}
          className='d-flex justify-content-center align-items-center'
        >
          <Button variant='primary' onClick={() => setShowModal(true)}>
            Build Your Form
          </Button>
        </div>
      ) : (
        <div className='container'>
          <BuildFormLanding form={form} setShowModal={setShowModal} />
        </div>
      )}
    </>
  );
};

const FormInput = ({ createFormHandler, loading }) => {
  const [name, setName] = useState('');
  const formSubmitHandler = e => {
    e.preventDefault();
    const body = {
      name
    };
    createFormHandler(body);
  };
  return (
    <form className='d-flex flex-column' onSubmit={formSubmitHandler}>
      <div className='form-group'>
        <label for='name'>Name</label>
        <input
          type='text'
          className='form-control'
          id='name'
          required
          onChange={e => setName(e.target.value)}
        />
      </div>
      <button className='btn btn-primary align-self-end'>
        {loading ? 'Loading...' : 'Save'}
      </button>
    </form>
  );
};

export default FormCreateLanding;
