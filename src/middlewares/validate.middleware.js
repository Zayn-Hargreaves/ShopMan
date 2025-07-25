const Joi = require('joi');
const { BadRequestError } = require('../cores/error.response');

const validate = (schema, property = 'body') => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req[property], { abortEarly: false });
            next();
        } catch (error) {
            const errorMessages = error.details.map((detail) => detail.message).join(', ');
            throw new BadRequestError(`Validation error: ${errorMessages}`);
        }
    };
};

module.exports = validate;