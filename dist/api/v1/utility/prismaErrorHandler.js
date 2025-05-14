import { Prisma } from "@prisma/client";
function capitalizeFirstLetter(text) {
    if (!text)
        return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
/**
 * Handles Prisma errors and returns a user-friendly error message.
 *
 * @param {object} error - The Prisma error object.
 * @returns {string} - A user-friendly error message.
 */
export const prismaErrorHandler = (error) => {
    var _a, _b, _c;
    logHttp("error", error);
    // Handle known errors
    switch (error.code) {
        case "P2002":
            return `${capitalizeFirstLetter((_c = (_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "Unknown target")} must be unique`;
        case "P2003":
            return "Foreign key constraint failed";
        case "P2025":
            return "Record not found";
        default:
            break;
    }
    // Handle other Prisma errors
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        return "An unknown error occurred";
    }
    else if (error instanceof Prisma.PrismaClientRustPanicError) {
        return "A Rust panic occurred";
    }
    else if (error instanceof Prisma.PrismaClientInitializationError) {
        return "Failed to initialize Prisma Client";
    }
    else if (error instanceof Prisma.PrismaClientValidationError) {
        return "Missing field or empty field or invalid data type";
    }
    else {
        return "An unexpected error occurred";
    }
};
//# sourceMappingURL=prismaErrorHandler.js.map