const { createTokenPair, verifyJWT, createAccessToken, createRefreshToken, createResetToken } = require('../../auth/authUtils');
const { NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, InternalServerError, BadRequestError } = require('../../cores/error.response');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require("google-auth-library");
const ClientId = process.env.GOOGLE_CLIENT_ID;
const Client = new OAuth2Client(ClientId);
const RedisService = require('./Redis.Service');
const { v4: uuidv4 } = require("uuid");
const { getInfoData } = require('../../utils/index');
const EmailService = require('./Email.service');
const otpGenerator = require("otp-generator");
const accessSecretKey = process.env.ACCESS_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const RepositoryFactory = require("../../models/repositories/repositoryFactory")

class AuthService {
    static async signUp({ name, email, password }) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const CartRepository = RepositoryFactory.getRepository("CartRepository")
        const holderAccount = await UserRepository.findByEmail(email);
        if (holderAccount) {
            throw new ConflictError('Email is already registered');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.createUser({
            name,
            email,
            password: passwordHash,
            status: "active"
        });
        const cart = await CartRepository.getOrCreateCart(newUser.id);
        const userId = newUser.id;
        const jti = uuidv4();
        const tokens = await createTokenPair({ userId, jti });
        return {
            user: getInfoData({
                fields: ["id", "name", "email", "phone", "status", "avatar"],
                object: newUser,
            }),
            tokens
        };
    }

    static async login({ email, password }) {
        await RepositoryFactory.initialize()

        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        if (!email || !password) {
            throw new UnauthorizedError('Email or password is required');
        }
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("Account not found");
        }
        if (!user.password) {
            throw new UnauthorizedError("Account does not support password login");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError("Email or password incorrect");
        }
        if (user.status !== "active") {
            throw new ForbiddenError("Account is not active");
        }
        const userId = user.id;
        const jti = uuidv4();
        const tokens = await createTokenPair({ userId, jti });
        return {
            user: getInfoData({
                fields: ["id", "name", "email", "phone", "status", "avatar"],
                object: user,
            }),
            tokens
        };
    }

    static async loginWithGoogle(body) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const CartRepository = RepositoryFactory.getRepository("CartRepository")
        const { idToken } = body;
        if (!idToken) {
            throw new UnauthorizedError("Id token is required");
        }
        const ticket = await Client.verifyIdToken({
            idToken,
            audience: ClientId
        });
        if (!ticket) {
            throw new UnauthorizedError("Login by google error");
        }
        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];
        let cart
        // Tìm người dùng bằng googleId hoặc email
        let user = await UserRepository.findByGoogleIdOrEmail(googleId,email);

        if (!user) {
            // Tạo tài khoản mới nếu không tìm thấy
            user = await UserRepository.createUser({
                googleId,
                email,
                name,
                status: "active"
            });
            cart = await CartRepository.getOrCreateCart(user.id);
        } else if (!user.googleId) {
            cart = await CartRepository.getOrCreateCart(user.id );
            user.googleId = googleId;
            await user.save();
        }

        if (user.status !== "active") {
            throw new ForbiddenError("Account is not active");
        }
        const userId = user.id;
        const jti = uuidv4();
        const tokens = await createTokenPair({ userId, jti });

        return {
            user: getInfoData({
                fields: ["id", "name", "email", "phone", "status", "avatar"],
                object: user
            }),
            tokens
        };
    }

    static async linkGoogle(idToken) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const { userId } = verifyJWT(idToken, accessSecretKey);
        const ticket = await Client.verifyIdToken({
            idToken,
            audience: ClientId
        });
        if (!ticket) {
            throw new UnauthorizedError("Invalid Google token");
        }
        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];

        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        if (user.googleId) {
            throw new ConflictError("Account already linked with Google");
        }
        if (user.email !== email) {
            throw new ConflictError("Google email does not match account email");
        }

        user.googleId = googleId;
        return await user.save();
    }

    static async logout(refreshToken) {
        const decode = verifyJWT(refreshToken, refreshSecretKey);
        const { jti } = decode;
        const state = await RedisService.addElementToRedisBloomFilter("blacklist_token", jti);
        if (!state) {
            throw new InternalServerError("Logout failed");
        }
        return state;
    }

    static async handleRefreshToken(refreshToken) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const decode = verifyJWT(refreshToken, refreshSecretKey);
        const { userId, jti } = decode;
        const holderUser = await UserRepository.findById(userId);
        if (!holderUser) {
            throw new UnauthorizedError("Something went wrong, please relogin");
        }
        const usedToken = await RedisService.checkElementExistInRedisBloomFilter("blacklist_token", jti);
        if (usedToken) {
            throw new UnauthorizedError("Something went wrong, please relogin");
        }
        const accessToken = createAccessToken({ userId, jti });
        const newTokens = { accessToken, refreshToken };
        return newTokens;
    }

    static async forgotPassword(email) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const OtpRepository = RepositoryFactory.getRepository("OtpRepository")
        const holderUser = await UserRepository.findByEmail(email);
        if (!holderUser) {
            throw new NotFoundError("Email is not registered");
        }
        const newOtpValue = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true, // Đảm bảo chỉ sinh số
        });
        const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
        const newOtp = await OtpRepository.createOtp({
            otp_value: newOtpValue,
            UserId: holderUser.id,
            expire: expireTime
        });
        const emailService = new EmailService(holderUser, 'http')
        await emailService.sendOtpCode({
            template: "reset-password",
            subject: "OTP for reset password",
            otp: newOtpValue
        });
        return { otp: newOtpValue };
    }

    static async checkOtp(otp) {
        await RepositoryFactory.initialize()
        const OtpRepository = RepositoryFactory.getRepository("OtpRepository")

        if (!otp) {
            throw new BadRequestError("OTP is required");
        }
        const holderOtp = await OtpRepository.findByValue(otp);
        if (!holderOtp) {
            throw new NotFoundError("OTP not found");
        }
        if (new Date() > holderOtp.expire) {
            await OtpRepository.deleteOtp(otp);
            throw new UnauthorizedError("OTP has expired. Please request a new one.");
        }
        const userId = holderOtp.UserId;
        const resetToken = createResetToken({ userId: userId });
        await OtpRepository.deleteOtp(otp);
        return { resetToken };
    }

    static async changePassword({ resetToken, newPassword, confirmedPassword }) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        if (!resetToken || !newPassword || !confirmedPassword) {
            throw new BadRequestError("All fields are required");
        }
        if (newPassword !== confirmedPassword) {
            throw new ConflictError("Confirmed password does not match");
        }
        const decode = verifyJWT(resetToken, accessSecretKey);

        const holderUser = await UserRepository.findById(decode.userId);
        if (!holderUser) {
            throw new NotFoundError("User not found");
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        const result = await UserRepository.updatePassword(decode.userId, hashPassword);
        if (!result || result[0] === 0) {
            throw new BadRequestError("Failed to update password");
        }
        const userId = holderUser.id;
        const jti = uuidv4();
        const tokens = await createTokenPair({ userId, jti });
        return {
            user: getInfoData({
                fields: ["id", "name", "email", "phone", "status", "avatar"],
                object: holderUser
            }),
            tokens
        };
    }
    static async updateFcmToken({ userId, fcmToken }) {
        await RepositoryFactory.initialize()
        const UserRepository = await RepositoryFactory.getRepository("UserRepository")
        const user = await UserRepository.findById(userId)
        if(!user){
            throw NotFoundError("User not found")
        }
        Object.assign(user,fcmToken)
        user.save()
        return user
    }
}

module.exports = AuthService;