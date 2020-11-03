const express = require('express');

const fieldController = require('../controllers/fieldController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(fieldController.save)
  .get(fieldController.findAll);

router
  .route('/:id')
  .put(fieldController.update)
  .delete(fieldController.delete);

router.route('/bulkUpdate').post(fieldController.bulkUpdate);

module.exports = router;
