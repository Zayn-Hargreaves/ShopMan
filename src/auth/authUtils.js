const jwt = require('jsonwebtoken');

const { asyncHandler } = require('../helpers/asyncHandler');
const { UnauthorizedError } = require('../cores/error.response');
const RedisService = require("../services/Redis.Service")
const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

const accessSecretKey1 = process.env.ACCESS_SECRET_KEY;
const refreshSecretKey1 = process.env.REFRESH_SECRET_KEY;
let access
let refresh
const createAccessToken = (payload) => {
    return jwt.sign(payload, Buffer.from(accessSecretKey, 'utf-8'), {
        algorithm: 'HS256',
        expiresIn: '2h',
    });
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, Buffer.from(refreshSecretKey, 'utf-8'), {
        algorithm: 'HS256',
        expiresIn: '7d',
    });
}
const createResetToken = (payload) => {
    return jwt.sign(payload, Buffer.from(accessSecretKey, 'utf-8'), {
        algorithm: 'HS256',
        expiresIn: '15m',
    });
}
const createTokenPair = async (payload) => {
    try {

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        jwt.verify(accessToken, Buffer.from(accessSecretKey, 'utf-8'), (err, decode) => {
            if (err) {
                console.error('error verify::', err);
            } else {
                console.log('decode verify::', decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error);
    }
}
const verifyJWT = (token, keySecret) => {
    const decoded = jwt.verify(token, Buffer.from(keySecret, 'utf-8'));
    return decoded
}

const authentication = asyncHandler(async (req, res, next) => {
    const authorization = req.headers[HEADER.AUTHORIZATION];
    let accessToken;
    if (authorization) {
        accessToken = authorization.split(' ')[1];
    }

    const refreshtoken = req.headers[HEADER.REFRESHTOKEN];
    if (!accessToken && !refreshtoken) {
        throw new UnauthorizedError('invalid request');
    }
    if (refreshtoken) {
        try {
            const { userId, jti } = verifyJWT(refreshtoken, refreshSecretKey);
            const exists = await RedisService.checkElementExistInRedisBloomFilter("blacklist_token", jti)
            if (exists) throw new UnauthorizedError("invalid request")
            req.userId = userId
            req.refreshToken = refreshtoken;
            return next();
        } catch (error) {
            console.log(error)
            throw new UnauthorizedError('invalid request::');
        }
    }
    if (accessToken) {
        try {
            const { userId, jti } = verifyJWT(accessToken, accessSecretKey);
            req.userId = userId
            req.accessToken = accessToken;
            if (!userId) {
                throw new UnauthorizedError('invalid request');
            }
            return next();
        } catch (error) {
            throw new UnauthorizedError(`invalid request::${error}`);
        }
    }
})

const optionalAuthentication = asyncHandler(async (req, res, next) => {
    const authorization = req.headers[HEADER.AUTHORIZATION]
    let accessToken
    if (authorization) accessToken = authorization.split(' ')[1];

    if (accessToken) {
        try {
            const { userId, jti } = verifyJWT(accessToken, accessSecretKey);
            if (!userId) {
                throw new UnauthorizedError('Invalid request');
            }
            req.userId = userId;
        } catch (error) {
            throw new UnauthorizedError(`Invalid token${error}`);
        }
    }
    next()
})





module.exports = { createTokenPair, authentication, verifyJWT, createAccessToken, createRefreshToken, createResetToken, optionalAuthentication }