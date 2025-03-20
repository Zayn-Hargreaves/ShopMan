const jwt = require('jsonwebtoken');

const { asyncHandler } = require('../helpers/asyncHandler');
const { UnauthorizedError } = require('../cores/error.response');
const redisClient = require("../db/rdb")
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

const authentication = asyncHandler(async (req, res, next) => {
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
            const {userId, roleId} = await verifyJWT(refreshtoken, refreshSecretKey);
            req.decode = {userId, roleId};
            req.refreshToken = refreshtoken;
            return next();
        } catch (error) {
            throw new UnauthorizedError('invalid request');
        }
    }
    if(accessToken){
        try {
            const {userId, roleId} = await verifyJWT(accessToken, accessSecretKey);
            req.decode = {userId, roleId};
            req.accessToken = accessToken;
            if(!userId){
                throw new UnauthorizedError('invalid request');
            }
            if(!roleId){
                throw new UnauthorizedError('invalid request');
            }
            const permissions = await PermissionService.getPermissionByRoleId(roleId);
            if(!permissions){
                throw new UnauthorizedError('invalid request');
            }
            req.permissions = permissions;
            return next();
        } catch (error) {
            throw new UnauthorizedError('invalid request');
        }
    }
})


module.exports = { createTokenPair, authentication, verifyJWT,createAccessToken,createRefreshToken }