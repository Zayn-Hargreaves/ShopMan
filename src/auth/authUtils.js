const jwt = require('jsonwebtoken');

const { asyncHandler } = require('../helpers/asyncHandler');
const { UnauthorizedError, NotFoundError, ForbiddenError } = require('../cores/error.response');
const RedisService = require("../services/client/Ris.Service");
const RepositoryFactory = require('../models/repositories/repositoryFactory');
const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

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

const checkShop = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const shopId = req.params.ShopId || req.body.ShopId || req.query.ShopId;
    if (!shopId) throw new NotFoundError("Shop not found");
    await RepositoryFactory.initialize();
    const shopUserRoleRepo = RepositoryFactory.getRepository("ShopUserRoleRepository");
    const memberShip = await shopUserRoleRepo.findMemberShip(userId, shopId);
    if (!memberShip) {
        throw new ForbiddenError("You don't have permission to access this shop");
    }
    req.RoleId = memberShip.RoleId;
    req.ShopId = memberShip.ShopId;
    req.ShopStatus = memberShip.shop?.status
    req.Role = memberShip.role?.role_name;
    next();
});


const checkPermission = (resource, action) => asyncHandler(async (req, res, next) => {
    const  roleId  = req.RoleId;
    if(req.Role == "superadmin"){
        return next()
    }
    if(req.params.AdminShopId && req.params.AdminShopId !== req.ShopId){
        throw new ForbiddenError("you dont have permission to access this resource")
    }
    await RepositoryFactory.initialize()
    const RoleGrantRepo = RepositoryFactory.getRepository("RoleGrantRepository")
    let grants = await RedisService.get(`role_grants:${roleId}`);
    if (!grants) {
        // Nếu chưa có thì query DB
        grants = await RoleGrantRepo.findAllRoleGrant(roleId)
        await RedisService.set(`role_grants:${roleId}`, grants, 3600);
    }
    // Kiểm tra quyền
    const allowed = grants.some(g => g.resource.name === resource && g.actions.includes(action));
    if (!allowed) throw new ForbiddenError('Permission denied');
    next();
});

const checkShopActive = asyncHandler((req, res, next) => {
    if (req.ShopStatus !== 'active') {
        throw new ForbiddenError('Shop chưa được duyệt hoặc đã bị khóa!');
    }
    next();
})



module.exports = { createTokenPair, authentication, verifyJWT, createAccessToken, createRefreshToken, createResetToken, optionalAuthentication, checkShop, checkPermission, checkShopActive}