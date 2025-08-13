"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredentials = void 0;
const rest_1 = require("@loopback/rest");
function validateCredentials(credentials) {
    // Validate Email
    if (!credentials.email || !isValidEmail(credentials.email)) {
        throw new rest_1.HttpErrors.UnprocessableEntity('Invalid email');
    }
    // Validate Password Length
    if (!credentials.password || credentials.password.length < 6) {
        throw new rest_1.HttpErrors.UnprocessableEntity('Password must be minimum 6 characters');
    }
}
exports.validateCredentials = validateCredentials;
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//# sourceMappingURL=validator.service.js.map