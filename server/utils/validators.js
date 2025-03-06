exports.validatePassword = (password) => {
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
