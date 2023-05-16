const express = require('express');
const contacts = require("../../controllers/contacts")

const router = express.Router()

router.get('/', (req, res) => {
  console.log(contacts.getAll);
  contacts.getAll(req, res);
})

router.get('/:contactId', (req, res) => {
  contacts.getById(req, res);
});

router.post('/', (req, res) => {
  contacts.addContact(req, res);
})

router.delete('/:contactId', (req, res) => {
  contacts.removeContact(req, res);
})

router.put('/:contactId', (req, res) => {
  contacts.updateContact(req, res);
})

router.patch('/:id/favorite', (req, res) => {
  contacts.updateStatusContact(req, res);
})

module.exports = router
