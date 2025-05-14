var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import path from "path"; // Import the 'path' module
import "dotenv/config";
// Get the current directory path using import.meta.url
const currentDir = path.dirname(new URL(import.meta.url).pathname);
const ENV = process.env;
const transporter = nodemailer.createTransport({
    host: ENV.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: ENV.MAIL_USERNAME,
        pass: ENV.MAIL_PASSWORD,
    },
});
export const sendMail = (receiverMail, username, resetLink) => {
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            // Use path.resolve to get the absolute path
            const filePath = path.resolve(currentDir, "../mail-template/forgot-password.html");
            // logHttp("info", `Reading HTML template from: ${filePath}`);
            let htmlContent = readFileSync(filePath, "utf-8");
            // logHttp("info", htmlContent);
            // Replace placeholders
            htmlContent = htmlContent.replace(/{{displayName}}/g, username).replace(/{{resetLink}}/g, resetLink);
            // Send email
            yield transporter.sendMail({
                from: ENV.MAIL_USERNAME,
                to: receiverMail,
                subject: "Password Reset Link",
                html: htmlContent,
            });
            // console.log("Message sent:", info.messageId);
        });
    }
    main().catch(console.error);
};
//# sourceMappingURL=sendMail.js.map