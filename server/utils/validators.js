import Joi from 'joi';

const usernameSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
});

const emailSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required()
});

export const validateUsername = (username) => {
    const { error, value } = usernameSchema.validate({ username: username });
    if (error) {
        return { isValid: false, error: error.details };
    }
    return { isValid: true };
};

export const validateEmail = (email) => {
    const { error, value } = emailSchema.validate({ email: email });
    if (error) {
        return { isValid: false, error: error.details };
    }
    return { isValid: true };
};

export const validatePassword = (password) => {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/;

    let errors = [];

    if (password.length < minLength) errors.push('Password must be at least 8 characters long.');
    if (!uppercaseRegex.test(password)) errors.push('Password must contain at least one uppercase letter.');
    if (!lowercaseRegex.test(password)) errors.push('Password must contain at least one lowercase letter.');
    if (!numberRegex.test(password)) errors.push('Password must contain at least one number.');
    if (!specialCharacterRegex.test(password)) errors.push('Password must contain at least one special character.');

    return { isValid: errors.length === 0, errors };
};
