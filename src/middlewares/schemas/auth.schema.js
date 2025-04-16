const Joi = require('joi');

const authSchemas = {
    login: Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
    }),

    signup: Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Name must be at least 2 characters long',
                'string.max': 'Name must not exceed 50 characters',
                'any.required': 'Name is required',
            }),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'any.required': 'Password is required',
            }),
    }),

    loginWithGoogle: Joi.object({
        idToken: Joi.string()
            .required()
            .messages({
                'any.required': 'Google ID token is required',
            }),
    }),

    linkGoogle: Joi.object({
        idToken: Joi.string()
            .required()
            .messages({
                'any.required': 'Google ID token is required',
            }),
    }),

    forgotPassword: Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required',
            }),
    }),

    checkOtp: Joi.object({
        opt: Joi.string()
            .length(6)
            .pattern(/^[0-9]+$/)
            .required()
            .messages({
                'string.length': 'OTP must be exactly 6 digits',
                'string.pattern.base': 'OTP must contain only digits',
                'any.required': 'OTP is required',
            }),
    }),

    changePassword: Joi.object({
        resetToken: Joi.string()
            .required()
            .messages({
                'any.required': 'Reset token is required',
            }),
        newPassword: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': 'New password must be at least 6 characters long',
                'any.required': 'New password is required',
            }),
        confirmedPassword: Joi.string()
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Confirmed password must match new password',
                'any.required': 'Confirmed password is required',
            }),
    }),

    logout: Joi.object({
        refreshToken: Joi.string()
            .required()
            .messages({
                'any.required': 'Refresh token is required',
            }),
    }),

    handleRefreshToken: Joi.object({
        refreshToken: Joi.string()
            .required()
            .messages({
                'any.required': 'Refresh token is required',
            }),
    }),
};

module.exports = authSchemas;