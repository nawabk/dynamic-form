import React, { useState, useEffect } from 'react';
import axios from 'axios';

import NewFieldForm from './NewFieldForm';
import BuildForm from './BuildForm';
import { BASE_URL } from '../utils/shared';

const BuildFormLanding = ({ form, setShowModal }) => {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    async function getAllFieldsOfForm() {
      try {
        const res = await axios.get(`${BASE_URL}/api/forms/${form._id}/fields`);
        setFields(res.data);
      } catch (err) {}
    }
    getAllFieldsOfForm();
  }, [form]);

  return (
    <div style={{ height: '70vh' }}>
      <BuildFormHeader form={form} setShowModal={setShowModal} />
      <div className='row mt-4'>
        <div
          className='col-md-6'
          style={{ borderRight: '1px dashed #333', minHeight: '50vh' }}
        >
          <BuildForm
            fields={fields}
            setSelectedField={setSelectedField}
            setFields={setFields}
          />
        </div>

        <div className='col-md-6'>
          <NewFieldForm
            form={form}
            setFields={setFields}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </div>
      </div>
    </div>
  );
};

const BuildFormHeader = ({ form, setShowModal }) => {
  return (
    <div className='row'>
      <div className='col-md-6'>
        <h4>{form.name}</h4>
      </div>
      <div className='col-md-6'>
        <button
          className='btn btn-primary btn-sm float-right'
          onClick={() => setShowModal(true)}
        >
          Create New Form
        </button>
      </div>
    </div>
  );
};

export default BuildFormLanding;
