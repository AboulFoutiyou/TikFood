"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthenticationStrategy = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
class JWTAuthenticationStrategy {
    constructor() {
        this.name = 'jwt';
    }
    async authenticate(request) {
        const token = this.extractCredentials(request);
        const userProfile = await this.verifyToken(token);
        return userProfile;
    }
    extractCredentials(request) {
        if (!request.headers.authorization) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header not found.`);
        }
        const authHeaderValue = request.headers.authorization;
        if (!authHeaderValue.startsWith('Bearer')) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header is not of type 'Bearer'.`);
        }
        const parts = authHeaderValue.split(' ');
        if (parts.length !== 2)
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`);
        return parts[1];
    }
    async verifyToken(token) {
        if (!token) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : 'token' is null`);
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const userProfile = {
                [security_1.securityId]: decodedToken.id,
                name: decodedToken.name,
                id: decodedToken.id,
                email: decodedToken.email,
                roles: decodedToken.roles,
            };
            return userProfile;
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
        }
    }
}
exports.JWTAuthenticationStrategy = JWTAuthenticationStrategy;
//# sourceMappingURL=jwt-strategy.js.map