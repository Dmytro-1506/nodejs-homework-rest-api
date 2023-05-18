const express = require('express');
const contacts = require("../../controllers/contacts");
const { authenticate, isValidId } = require('../../middlewares');

const router = express.Router()

router.get('/', authenticate, (req, res, next) => {
  contacts.getAll(req, res, next);
})

router.get('/:contactId', authenticate, isValidId, (req, res, next) => {
  contacts.getById(req, res, next);
});

router.post('/', authenticate, (req, res, next) => {
  contacts.addContact(req, res, next);
})

router.delete('/:contactId', authenticate, isValidId, (req, res, next) => {
  contacts.removeContact(req, res, next);
})

router.put('/:contactId', authenticate, isValidId, (req, res, next) => {
  contacts.updateContact(req, res, next);
})

router.patch('/:id/favorite', authenticate, isValidId, (req, res, next) => {
  contacts.updateStatusContact(req, res, next);
})

module.exports = router
