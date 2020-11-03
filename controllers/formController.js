const Form = require('../models/Form');
const catchAsync = require('../utils/catchAsync');

exports.save = catchAsync(async (req, res, next) => {
  const form = await Form.create(req.body);
  res.status(201).json(form);
});

exports.update = catchAsync(async (req, res, next) => {
  const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  res.status(201).json(updatedForm);
});

exports.getLastForm = catchAsync(async (req, res, next) => {
  const form = await Form.find().limit(1);
  res.json(form);
});
