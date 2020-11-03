const mongoogse = require('mongoose');

const formSchema = new mongoogse.Schema({
  name: {
    type: String,
    required: [true, 'Form name is required']
  }
});

const Form = mongoogse.model('Form', formSchema);

module.exports = Form;
