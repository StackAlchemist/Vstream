"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignupErrors = void 0;
const handleSignupErrors = (err) => {
    var _a;
    const errors = {};
    // Duplicate key error (email must be unique)
    if (err.code === 11000 && ((_a = err.keyPattern) === null || _a === void 0 ? void 0 : _a.email)) {
        errors.email = 'That email is already registered';
        return errors;
    }
    // Mongoose validation errors
    if (err.message.includes('users validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            if ((properties === null || properties === void 0 ? void 0 : properties.path) && (properties === null || properties === void 0 ? void 0 : properties.message)) {
                errors[properties.path] = properties.message;
            }
        });
    }
    // Custom thrown login errors (from login method)
    if (err.message === 'Wrong Credentials') {
        errors.general = 'Incorrect email or password';
    }
    if (err.message === 'I know not this man') {
        errors.email = 'Invalid Email or Password';
    }
    return errors;
};
exports.handleSignupErrors = handleSignupErrors;
