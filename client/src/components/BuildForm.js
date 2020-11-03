import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BASE_URL } from '../utils/shared';

const BuildForm = ({ fields, setSelectedField, setFields }) => {
  const [dynamicForm, setDynamicForm] = useState([]);
  const [map, setMap] = useState(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (map.size > 0) {
      setFields(prevFields =>
        prevFields.map(field =>
          map.has(field._id) ? map.get(field._id) : field
        )
      );
    }
  }, [map, setFields]);

  useEffect(() => {
    let arr = [];
    fields.forEach(field => {
      arr.push({ _id: field._id, value: field.value });
    });
    setDynamicForm(arr);
  }, [fields]);

  const formSubmitHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/fields/bulkUpdate`,
        dynamicForm
      );
      res.data.forEach(field => {
        map.set(field._id, field);
        setMap(map);
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    fields.length > 0 && (
      <form onSubmit={formSubmitHandler}>
        {fields.map(field => (
          <div key={field._id} className='d-flex '>
            <FormElement
              field={field}
              dynamicForm={dynamicForm}
              setDynamicForm={setDynamicForm}
            />
            <button
              className='btn btn-warning btn-sm ml-2 align-self-center mt-2'
              onClick={() => setSelectedField(field)}
              type='button'
            >
              Update
            </button>
          </div>
        ))}
        <button
          className='btn btn-primary btn-sm float-right mr-5'
          type='submit'
        >
          {loading ? 'Loading...' : 'Save'}
        </button>
      </form>
    )
  );
};

const FormElement = ({ field, setDynamicForm }) => {
  let content = null;
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [classAttr, setClassAttr] = useState('');
  const [size, setSize] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (field.value) setValue(field.value);
    if (field.attributes.length > 0) {
      field.attributes.forEach(attr => {
        for (let key in attr) {
          if (key === 'id') setId(attr[key]);
          else if (key === 'name') setName(attr[key]);
          else if (key === 'class') setClassAttr(attr[key]);
          else if (key === 'size') setSize(attr[key]);
        }
      });
    }
  }, [field]);

  const fieldChangeHandler = e => {
    setValue(e.target.value);
    const value = e.target.value;
    setDynamicForm(prevForm =>
      prevForm.map(form => {
        if (form._id === field._id) return { ...form, value };
        else return form;
      })
    );
  };

  switch (field.element) {
    case 'input':
      content = (
        <div className='form-group'>
          <label htmlFor={field.id}>{field.labelName}</label>
          <input
            type='text'
            className={`form-control ${classAttr}`}
            id={id}
            name={name}
            size={size}
            value={value}
            onChange={fieldChangeHandler}
          />
        </div>
      );
      break;
    case 'textarea':
      content = (
        <div className='form-group'>
          <label htmlFor={field.id}>{field.labelName}</label>
          <textarea
            className={`form-control ${classAttr}`}
            id={id}
            name={name}
            size={size}
            value={value}
            onChange={fieldChangeHandler}
          />
        </div>
      );
      break;
    default:
      break;
  }
  return content;
};

export default BuildForm;
