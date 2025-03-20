const { createTokenPair, verifyJWT, createAccessToken } = require('../auth/authUtils');
const { NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, InternalServerError } = require('../cores/error.response');
const UserService = require('./User.Service');
const { getInfoData } = require('../src/utils');
const bcrypt = require('bcrypt');
const redisClient = require("../db/rdb")
const { OAuth2Client } = require("google-auth-library")
const ClientId = process.env.GOOGLE_CLIENT_ID
const Client = new OAuth2Client(ClientId)
const User = require("../models/User.model");
const RedisService = require('./Redis.Service');
const {v4:uuidv4} = require("uuid")
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
class AuthService {
    static async signUp({ name, email, password }) {
        const holderAccount = await UserService.findByEmail(email);
        if (holderAccount) {
            throw new ConflictError('Email is already registered');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: passwordHash,
            status: 'active'
        });
        if (newUser) {
            const userId = newUser.id;
            const jti = uuidv4()
            const tokens = await createTokenPair({userId:userId, jti:jti});
            return {
                metadata: {
                    user: getInfoData({
                        fields: ['id', 'name', 'email'],
                        object: newUser
                    }),
                    tokens: tokens
                }
            }
        }
    }
    static async signUpWithGoogle(body) {
        const { idToken } = body
        if (!idToken) {
            throw new UnauthorizedError("Id token is required")
        }
        const ticket = await Client.verifyIdToken({
            idToken,
            audience: ClientId
        })
        if (!ticket) {
            throw new UnauthorizedError("Login by google error")
        }
        const payload = ticket.getPayload()
        const googleId = payload['sub']
        const email = payload['email']
        const name = payload['name']
        const user = await UserService.findByEmail(email)
        if (user) {
            throw new ConflictError("Email is already registered")
        }
        const NewUser = await User.create({
            id: googleId,
            name,
            email,
            status: "active"
        })
        const jti = uuidv4()
        const tokens = await createTokenPair({UserId:googleId, jti:jti})
        return {
            metadata: {
                user: getInfoData({
                    fields: ["id", "name", "email", "phone", 'status', 'avatar'],
                    object: NewUser
                }),
                tokens
            }
        }
    }
    static async login({ email, password, refreshToken = null }) {
        if (!email || !password || email === '' || password === '' || email === null || password === null || email === undefined || password === undefined) {
            throw new UnauthorizedError('Email or password is required');
        }
        if (!email.includes('@')) {
            throw new UnauthorizedError('Invalid email format')
        }
        const user = await UserService.findByEmail(email)
        if (!user) {
            throw new NotFoundError("Account not found")
        }
        const passwordHash = await bcrypt.hash(password, 10)
        if(user.password != passwordHash){
            throw new UnauthorizedError("Email or password incorrect")
        }
        const userId = user.id
        const jti = uuidv4()
        const tokens = await createTokenPair({Userid:userId, jti:jti})
        return {
            metadata: {
                user: getInfoData({
                    fields: ["id", "name", "email", "phone", 'status', 'avatar'],
                    object: user
                }),
                tokens
            }
        }
    }
    static async loginWithGoogle(body) {
        const { idToken } = body
        if (!idToken) {
            throw new UnauthorizedError("Id token is required")
        }
        const ticket = await Client.verifyIdToken({
            idToken,
            audience: ClientId
        })
        if (!ticket) {
            throw new UnauthorizedError("Login by google error")
        }
        const payload = ticket.getPayload()
        const googleId = payload['sub']
        const email = payload['email']
        const name = payload['name']
        const user = await UserService.findById(googleId)
        if (!user) {
            throw new NotFoundError("Account not found")
        }
        const userId = user.id
        const jti = uuidv4()
        const tokens = await createTokenPair({userId:userId,jti:jti})
        return {
            metadata: {
                user: getInfoData({
                    fields: ["id", "name", "email", "phone", 'status', 'avatar'],
                    object: user
                }),
                tokens
            }
        }
    }
    static async logout({refreshToken}) {
        const decode = await verifyJWT(refreshToken, refreshSecretKey)
        const {jti} = decode
        const state = await RedisService.addElementToRedisBloomFilter("blacklist_token",jti)
        if(!state){
            throw new InternalServerError("Logout failed")
        }
        return state
    
    }
    static async handleRefreshToken({refreshToken}) {
        const decode = await verifyJWT(refreshToken,refreshSecretKey)
        const {userId,jti} = decode
        const holderUser = await UserService.findById(userId)
        if(!holderUser){
            throw new UnauthorizedError("Something went wrong, please relogin")
        }
        const usedToken = await RedisService.checkElementExistInRedisBloomFilter("blacklist_token",jti)
        if(usedToken === true){
            throw new UnauthorizedError("Something went wrong, please relogin")
        }
        const accessToken = createAccessToken({userId:userId, jti:jti})
        const newTokens = {accessToken:accessToken, refreshToken:refreshToken}
        return newTokens
    }
}

module.exports = AuthService