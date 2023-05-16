const Joi = require('joi');
const { RequestError, ctrlWrapper } = require("../helpers");
const Contact = require("../models/contact")

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
});

const bookUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const getAll = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
};

const getById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        return RequestError(404, "Not found");
    };
    res.json(result);
};

const addContact = async (req, res) => {
    const { error } = addSchema.validate(req.body);
    if (error) {
        return RequestError(400, "missing required name field")
    };
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        return RequestError(404, "Not found")
    }
    res.status(200).json({ message: 'contact deleted' });
};

const updateContact = async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
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
};

const updateStatusContact = async (req, res) => {
    const { error } = bookUpdateFavoriteSchema.validate(req.body)
    if (error) {
        throw RequestError(400, { "message": "missing field favorite" })
    }
    const { id } = req.params
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
    if (!result) {
        throw RequestError(404, 'Not Found')
    }
    res.json(result)
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}