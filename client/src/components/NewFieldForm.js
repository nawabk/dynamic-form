import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BASE_URL } from '../utils/shared';

const NewFieldForm = ({ form, setFields, selectedField, setSelectedField }) => {
  const [element, setElement] = useState('input');
  const [labelName, setLabelName] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [classAttr, setClassAttr] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(false);

  function clearFields() {
    setLabelName('');
    setId('');
    setName('');
    setClassAttr('');
    setSize('');
  }

  const formSubmitHandler = async e => {
    e.preventDefault();

    try {
      const attributes = [{ id }, { name }, { class: classAttr }, { size }];
      const body = {
        element,
        labelName,
        attributes
      };
      setLoading(true);

      if (selectedField) {
        const res = await axios.put(
          `${BASE_URL}/api/fields/${selectedField._id}`,
          body
        );
        setFields(prevFields =>
          prevFields.map(field => {
            if (field._id === selectedField._id) return res.data;
            else return field;
          })
        );
        setSelectedField(null);
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/forms/${form._id}/fields`,
          body
        );
        setFields(prevFields => [...prevFields, res.data]);
      }
      clearFields();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedField) {
      setLabelName(selectedField.labelName);
      selectedField.attributes.forEach(attr => {
        for (let key in attr) {
          if (key === 'id') setId(attr[key]);
          else if (key === 'name') setName(attr[key]);
          else if (key === 'class') setClassAttr(attr[key]);
          else if (key === 'size') setSize(attr[key]);
        }
      });
    }
  }, [selectedField]);

  const cancelHandler = () => {
    if (selectedField) {
      setSelectedField(null);
      clearFields();
    } else clearFields();
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <h5>{selectedField ? 'Update Field' : 'Create Field'}</h5>
      <div className='form-group'>
        <label htmlFor='element'>Element</label>
        <select
          id='element'
          className='form-control form-control-sm'
          required
          value={element}
          onChange={e => setElement(e.target.value)}
        >
          <option value='input'>input</option>
          <option value='textarea'>textarea</option>
        </select>
      </div>
      <div className='form-group'>
        <label htmlFor='labelName'>Label Name</label>
        <input
          type='text'
          id='labelName'
          className='form-control form-control-sm'
          value={labelName}
          onChange={e => setLabelName(e.target.value)}
          required
        />
      </div>
      <h6 style={{ textDecoration: 'underline' }}>Attributes</h6>
      <div className='form-group'>
        <label htmlFor='id'>id</label>
        <input
          type='text'
          id='id'
          className='form-control form-control-sm'
          value={id}
          onChange={e => setId(e.target.value)}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='name'>name</label>
        <input
          type='text'
          id='name'
          className='form-control form-control-sm'
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='class'>class</label>
        <input
          type='text'
          id='class'
          className='form-control form-control-sm'
          value={classAttr}
          onChange={e => setClassAttr(e.target.value)}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='size'>size</label>
        <input
          type='number'
          id='size'
          className='form-control form-control-sm'
          value={size}
          onChange={e => setSize(e.target.value)}
          required
        />
      </div>
      <button className='btn btn-primary btn-sm float-right ml-2' type='submit'>
        {!loading ? (selectedField ? 'Update' : 'Save') : 'Loading....'}
      </button>
      <button
        className='btn btn-secondary btn-sm float-right'
        type='button'
        onClick={cancelHandler}
      >
        Cancel
      </button>
    </form>
  );
};

export default NewFieldForm;
