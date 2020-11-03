const Field = require('../models/Field');
const catchAsync = require('../utils/catchAsync');

exports.findAll = catchAsync(async (req, res, next) => {
  const fields = await Field.find({ form: req.params.formId });
  res.json(fields);
});

exports.save = catchAsync(async (req, res, next) => {
  req.body.form = req.params.formId;
  const field = await Field.create(req.body);
  res.status(201).json(field);
});

exports.update = catchAsync(async (req, res, next) => {
  const updatedField = await Field.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  res.status(201).json(updatedField);
});

exports.delete = catchAsync(async (req, res, next) => {
  await Field.findByIdAndRemove(req.params.id);
  res.json({
    message: 'Deleted successfully'
  });
});

exports.bulkUpdate = catchAsync(async (req, res, next) => {
  const response = [];

  for (let reqBody of req.body) {
    const updatedField = await Field.findByIdAndUpdate(
      reqBody._id,
      { value: reqBody.value },
      { new: true, runValidators: true }
    );
    response.push(updatedField);
  }
  res.status(201).json(response);
});
