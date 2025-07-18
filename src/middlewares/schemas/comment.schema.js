const Joi = require("joi");

const commentSchemas = {
  getRootCommentsQuery: Joi.object({
    cursor: Joi.date().iso().optional().messages({
      "date.base": "cursor must be a valid ISO date",
    }),
    limit: Joi.number().integer().min(1).max(100).optional().messages({
      "number.base": "limit must be a number",
      "number.min": "limit must be at least 1",
      "number.max": "limit must be at most 100",
      "number.integer": "limit must be an integer",
    }),
  }),

  createCommentBody: Joi.object({
    content: Joi.string().min(1).required().messages({
      "string.base": "Content must be a string",
      "string.empty": "Content cannot be empty",
      "any.required": "Content is required",
    }),
    rating: Joi.number().min(1).max(5).optional().messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot exceed 5",
    }),
    ParentId: Joi.number().integer().allow(null).optional().messages({
      "number.base": "parentId must be a number",
      "number.integer": "parentId must be an integer",
    }),
    image_urls: Joi.array().items(Joi.string().uri()).optional().messages({
      "array.base": "image_urls must be an array of URLs",
      "string.uri": "Each image URL must be a valid URI",
    }),
  }),
};

module.exports = commentSchemas;
