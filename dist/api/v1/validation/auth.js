/**
 * String field validation
 *
 * @param {number} min
 * @param {number} max
 * @param {string} field
 */
const stringField = (min, max, field) => ({
    trim: true,
    escape: true,
    notEmpty: {
        errorMessage: `${field} is required`,
    },
    isString: { errorMessage: `${field} should be string` },
    isLength: {
        options: { min, max },
        errorMessage: `${field} must be between ${min} to ${max} characters`,
    },
});
/**
 * Integer field validation
 *
 * @param {number} min
 * @param {number} max
 * @param {string} field
 */
const intField = (min, max, field) => ({
    trim: true,
    escape: true,
    notEmpty: {
        errorMessage: `${field} is required`,
    },
    isInt: {
        errorMessage: `${field} will be a number`,
    },
    isLength: {
        options: { min, max },
        errorMessage: `${field} must be between ${min} to ${max} characters`,
    },
});
const emailField = {
    trim: true,
    escape: true,
    notEmpty: {
        errorMessage: "Email is required",
    },
    isEmail: {
        errorMessage: "Invalid email",
    },
};
const rememberMe = {
    trim: true,
    escape: true,
    toBoolean: true, // It will convert the value to boolean
    notEmpty: {
        errorMessage: "Remember Me is required",
    },
    isBoolean: {
        errorMessage: "Remember Me should be a boolean value",
    },
};
const logInSchema = {
    username: stringField(5, 20, "Username"),
    password: stringField(4, 12, "Password"),
    rememberMe,
};
/**
 * Schema definition for password reset request validation.
 */
const forgotPassSchema = {
    email: emailField,
};
/**
 * Schema definition for password reset validation.
 */
const resetPassSchema = {
    resetToken: {
        trim: true,
        escape: true,
        notEmpty: {
            errorMessage: "Reset Token is required",
        },
        isString: { errorMessage: "Reset Token should be string" },
    },
    password: stringField(4, 12, "Password"),
    confirmPassword: stringField(4, 12, "Confirm Password"),
};
/**
 * Schema definition for user sign-up validation.
 *
 * This schema extends the `logInSchema` and adds additional fields
 * required for user registration
 */
const signUpSchema = {
    username: Object.assign(Object.assign({}, stringField(5, 20, "Username")), { matches: {
            options: [/^[a-zA-Z0-9_]+$/],
            errorMessage: "Username can only contain letters, numbers, and underscores, and no spaces or special symbols are allowed",
        } }),
    password: stringField(4, 12, "Password"),
    displayName: stringField(2, 40, "Name"),
    mobileNumber: intField(10, 10, "Mobile Number"),
    email: emailField,
};
export { logInSchema, signUpSchema, forgotPassSchema, resetPassSchema };
//# sourceMappingURL=auth.js.map