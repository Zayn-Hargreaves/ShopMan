const jwt = require('jsonwebtoken');

const { asyncHandler } = require('../helpers/asyncHandler');
const { UnauthorizedError } = require('../cores/error.response');
const RedisService = require("../services/Redis.Service")
const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}   
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const createAccessToken = (payload) => {
    return jwt.sign(payload, accessSecretKey, {
        algorithm: 'HS256',
        expiresIn: '2h',
    });
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, refreshSecretKey, {
        algorithm: 'HS256',
        expiresIn: '7d',
    });
}
const createResetToken = (payload)=>{
    return jwt.sign(payload, accessSecretKey, {
        algorithm: 'HS256',
        expiresIn: '15p',
    });
}
const createTokenPair = async (payload) => {
    try {
        
        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);
        jwt.verify(accessToken, accessSecretKey, (err, decode) => {
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
const verifyJWT = async (token, keySecret) => {
    return jwt.verify(token, keySecret);
}

const authentication = asyncHandler(async(req, res, next) => {
    const authorization = req.headers[HEADER.AUTHORIZATION];
    let accessToken;
    if(authorization){
        accessToken= authorization.split(' ')[1];
    }
    const refreshtoken = req.headers[HEADER.REFRESHTOKEN];
    if(!accessToken && !refreshtoken){
        throw new UnauthorizedError('invalid request');
    }
    if(refreshtoken){
        try {
            const {userId, roleId,jti} = await verifyJWT(refreshtoken, refreshSecretKey);
            const exists = await RedisService.checkElementExistInRedisBloomFilter("blacklist_token",jti)
            if(!exists) throw new UnauthorizedError("invalid request")
            req.userId = userId
            req.refreshToken = refreshtoken;
            return next();
        } catch (error) {
            throw new UnauthorizedError('invalid request');
        }
    }
    if(accessToken){
        try {
            const {userId, roleId,jti} = await verifyJWT(accessToken, accessSecretKey);
            req.userId = userId
            req.accessToken = accessToken;
            if(!userId){
                throw new UnauthorizedError('invalid request');
            }
            return next();
        } catch (error) {
            throw new UnauthorizedError('invalid request');
        }
    }
})





module.exports = { createTokenPair, authentication, verifyJWT,createAccessToken,createRefreshToken, createResetToken }