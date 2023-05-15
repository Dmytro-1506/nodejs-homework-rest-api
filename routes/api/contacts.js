const express = require('express');
const Joi = require('joi');
const { RequestError } = require("../../helpers");
const Contact = require("../../models/contact")

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const bookUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      return RequestError(404, "Not found");
    };
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
    return RequestError(400, "missing required name field")
    };
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      return RequestError(404, "Not found")
    }
    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name & !email & !phone) {
      return RequestError(400, "missing fields")
    };
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
      select: '-createdAt -updatedAt',
    })
    if (!result) {
      return RequestError(404, "Not found")
    }
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
})

router.patch('/:id/favorite', async (req, res, next) => {
  try {
    const { error } = bookUpdateFavoriteSchema.validate(req.body)
    if (error) {
      throw RequestError(400, {"message": "missing field favorite"})
    }
    const { id } = req.params
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
    if (!result) {
      throw RequestError(404, 'Not Found')
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router
