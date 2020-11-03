const express = require('express');

const formController = require('../controllers/formController');
const fieldRouter = require('./fieldRoutes');

const router = express.Router();

router.use('/:formId/fields', fieldRouter);

router.route('/').post(formController.save);

router.route('/:id').put(formController.update);

router.route('/getCurrent').get(formController.getLastForm);

module.exports = router;
