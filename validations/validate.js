const Joi = require('joi');

const userRegistrationValidation = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "name must be string",
        'string.empty': 'First name cannot be empty.',
        'any.required': 'First name is a required field.'
    }),
    email: Joi.string().email().required().messages({
        "string.base": "email must be a string",
        "string.email": "Please enter a valid email",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.base": "password must be a string",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
    })
});

module.exports = { userRegistrationValidation };
