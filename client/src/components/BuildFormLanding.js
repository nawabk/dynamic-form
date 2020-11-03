import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BASE_URL } from '../utils/shared';

const BuildFormLanding = ({ form }) => {
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
      <BuildFormHeader form={form} />
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

const BuildFormHeader = ({ form }) => {
  return (
    <div className='row'>
      <div className='col-md-6'>
        <h4>{form.name}</h4>
      </div>
      <div className='col-md-6'>
        <button className='btn btn-primary btn-sm'>Add Fields</button>
      </div>
    </div>
  );
};

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

const BuildForm = ({ fields, setSelectedField, setFields }) => {
  const [dynamicForm, setDynamicForm] = useState([]);
  const [map, setMap] = useState(new Map());

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
      const res = await axios.post(
        `${BASE_URL}/api/fields/bulkUpdate`,
        dynamicForm
      );
      res.data.forEach(field => {
        map.set(field._id, field);
        setMap(map);
      });
    } catch (err) {}
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
          Save
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
          <label htmlFor={field.id}>{field.label}</label>
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

export default BuildFormLanding;
