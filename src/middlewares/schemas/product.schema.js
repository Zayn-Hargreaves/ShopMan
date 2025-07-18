const Joi = require("joi");

const productSchemas = {
    newArrivals: Joi.object({
        minPrice: Joi.number().min(0).optional().messages({
            "number.base": "minPrice must be a number",
            "number.min": "minPrice cannot be negative",
        }),
        maxPrice: Joi.number().min(0).optional().messages({
            "number.base": "maxPrice must be a number",
            "number.min": "maxPrice cannot be negative",
        }),
        lastSortValues: Joi.string().optional().messages({
            "string.base": "lastSortValues must be a JSON string",
        }),
        pageSize: Joi.number().integer().min(1).default(10).messages({
            "number.base": "pageSize must be a number",
            "number.min": "pageSize must be at least 1",
            "number.integer": "pageSize must be an integer",
        }),
        isAndroid: Joi.boolean().truthy("true").falsy("false").optional().messages({
            "boolean.base": "isAndroid must be a boolean (true or false)",
        }),
    }),

    productIdParam: Joi.object({
        productId: Joi.number().integer().required().messages({
            "any.required": "productId is required",
            "number.base": "productId must be a number",
            "number.integer": "productId must be an integer",
        }),
    }),

    productIdDiscountParam: Joi.object({
        ProductId: Joi.number().integer().required().messages({
            "any.required": "ProductId is required",
            "number.base": "ProductId must be a number",
            "number.integer": "ProductId must be an integer",
        }),
    }),
    productSlugParam: Joi.object({
        slug: Joi.string().required().messages({
            "any.required": "slug is required",
            "string.base": "slug must be a string",
        }),
    }),

    dealOfTheDayQuery: Joi.object({
        minPrice: Joi.number().min(0).optional().messages({
            "number.base": "minPrice must be a number",
            "number.min": "minPrice cannot be negative",
        }),
        maxPrice: Joi.number().min(0).optional().messages({
            "number.base": "maxPrice must be a number",
            "number.min": "maxPrice cannot be negative",
        }),
        sortBy: Joi.string().optional().messages({
            "string.base": "sortBy must be a JSON string",
        }),
        lastSortValues: Joi.string().optional().messages({
            "string.base": "lastSortValues must be a JSON string",
        }),
        pageSize: Joi.number().integer().min(1).optional().messages({
            "number.base": "pageSize must be a number",
            "number.min": "pageSize must be at least 1",
            "number.integer": "pageSize must be an integer",
        }),
        isAndroid: Joi.boolean().truthy("true").falsy("false").optional().messages({
            "boolean.base": "isAndroid must be a boolean",
        }),
    }),

    trendingQuery: Joi.object({
        cursorScore: Joi.string().optional().messages({
            "string.base": "cursorScore must be a string",
        }),
        limit: Joi.number().integer().min(1).optional().messages({
            "number.base": "limit must be a number",
            "number.min": "limit must be at least 1",
            "number.integer": "limit must be an integer",
        }),
    }),
};

module.exports = productSchemas;
