const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  element: {
    type: String,
    enum: ['input', 'textarea'],
    required: [true, 'Element  is required']
  },
  labelName: {
    type: String,
    required: [true, 'Label name is required']
  },
  value: {
    type: String
  },
  attributes: [
    {
      type: Object
    }
  ],
  form: {
    type: mongoose.Schema.ObjectId,
    ref: 'Form'
  }
});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;
