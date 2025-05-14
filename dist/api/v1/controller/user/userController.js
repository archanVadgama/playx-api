var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import ffmpeg from "fluent-ffmpeg";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utility/prismaErrorHandler.js";
import "dotenv/config";
import fs from "fs";
import sharp from "sharp";
const prisma = new PrismaClient();
// const customBasePath = `${process.cwd()}/uploads`;
const customBasePath = `${process.env.APP_URL}:${process.env.PORT}/uploads`;
// under development
export class UserController {
}
_a = UserController;
UserController.getFeedData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedData = yield prisma.video.findMany({
            where: {
                // isAgeRestricted: false,
                isPrivate: false,
                deletedAt: null, // Only non-deleted videos
                user: {
                    isBlock: false,
                    isAdmin: false,
                    suspendTill: null,
                    deletedAt: null,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                userId: true,
                uuid: true,
                title: true,
                duration: true,
                viewCount: true,
                createdAt: true,
                videoPath: true,
                thumbnailPath: true,
                user: {
                    select: {
                        username: true,
                        displayName: true,
                        channelName: true,
                        image: true,
                    },
                },
            },
        });
        const feedDataWithCustomPaths = feedData.map((video) => (Object.assign(Object.assign({}, video), { duration: Number(video.duration), viewCount: Number(video.viewCount), videoPath: `${customBasePath}/${video.videoPath}`, thumbnailPath: `${customBasePath}/${video.thumbnailPath}` })));
        if (!feedData) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "dataNotFound"));
            return;
        }
        res
            .status(StatusCodes.OK)
            .json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", feedDataWithCustomPaths));
    }
    catch (error) {
        throw new Error(prismaErrorHandler(error));
    }
});
UserController.getVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoUUID = req.params.uuid;
    if (!videoUUID) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidVideoId"));
        return;
    }
    try {
        const videoData = yield prisma.video.findUnique({
            where: { uuid: videoUUID.toString(), isPrivate: false, deletedAt: null },
            select: {
                uuid: true,
                title: true,
                duration: true,
                viewCount: true,
                createdAt: true,
                videoPath: true,
                thumbnailPath: true,
                user: {
                    select: {
                        username: true,
                        displayName: true,
                        channelName: true,
                        image: true,
                    },
                },
            },
        });
        if (!videoData) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoNotFound"));
            return;
        }
        const feedDataWithCustomPaths = Object.assign(Object.assign({}, videoData), { duration: Number(videoData.duration), viewCount: Number(videoData.viewCount), videoPath: `${customBasePath}/${videoData.videoPath}`, thumbnailPath: `${customBasePath}/${videoData.thumbnailPath}` });
        res
            .status(StatusCodes.OK)
            .json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", feedDataWithCustomPaths));
    }
    catch (error) {
        throw new Error(prismaErrorHandler(error));
    }
});
/**
 * @description Get user by id
 *
 * @static
 * @param {Request} req
 * @param {Response} res
 * @type {RequestHandler}
 * @memberof UserController
 */
UserController.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidUserId"));
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            omit: { password: true },
            where: { id: userId, isAdmin: false },
        });
        if (!user) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
            return;
        }
        res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", safeJson(user)));
    }
    catch (error) {
        throw new Error(prismaErrorHandler(error));
    }
});
UserController.uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        // Validation check
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json(apiResponse(ResponseCategory.ERROR, "validationFailed", result.formatWith((msg) => msg.msg).mapped()));
            return;
        }
        // File existence check
        const files = req.files;
        const videoFile = (_b = files === null || files === void 0 ? void 0 : files["video"]) === null || _b === void 0 ? void 0 : _b[0];
        const thumbnailFile = (_c = files === null || files === void 0 ? void 0 : files["thumbnail"]) === null || _c === void 0 ? void 0 : _c[0];
        if (!videoFile) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoIsRequired"));
            return;
        }
        if (!thumbnailFile) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "thumbnailIsRequired"));
            return;
        }
        const { userId, categoryId, isAgeRestricted, isPrivate, title, description, keywords } = req.body;
        // User existence check
        const user = yield prisma.user.findUnique({
            select: { username: true },
            where: { id: Number(userId) },
        });
        if (!user) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
            return;
        }
        const timestamp = Date.now();
        const videoFileName = `${timestamp}.mp4`;
        const thumbnailFileName = `${timestamp}.jpeg`;
        const paths = {
            thumbnailDB: `${user.username}/thumbnail/${thumbnailFileName}`,
            thumbnail: `uploads/${user.username}/thumbnail/${thumbnailFileName}`,
            videoDB: `${user.username}/video/${videoFileName}`,
            video: `uploads/${user.username}/video/${videoFileName}`,
        };
        // Ensure directories exist
        yield fs.promises.mkdir(`uploads/${user.username}/thumbnail`, { recursive: true });
        yield fs.promises.mkdir(`uploads/${user.username}/video`, { recursive: true });
        // Move files to their respective directories
        yield sharp(thumbnailFile.path)
            .resize(1280, 720, { fit: "cover", position: "centre" }) // Resize to 1280x720
            .jpeg({ quality: 80 })
            .toFile(paths.thumbnail);
        // Delete the old image
        yield fs.promises.unlink(thumbnailFile.path);
        if ((yield fs.promises.stat(paths.thumbnail)).size > 10 * 1024 * 1024) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "thumbnailTooLarge"));
            return;
        }
        yield fs.promises.rename(videoFile.path, paths.video);
        if (videoFile.size > 500 * 1024 * 1024) {
            res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "videoTooLarge"));
            return;
        }
        const duration = yield new Promise((resolve, reject) => ffmpeg.ffprobe(paths.video, (err, metadata) => err ? reject(err) : resolve(metadata.format.duration || 0)));
        yield prisma.video.create({
            data: {
                userId: Number(userId),
                categoryId: Number(categoryId),
                isAgeRestricted,
                isPrivate,
                title,
                description,
                keywords,
                size: videoFile.size,
                duration: duration.toFixed(4), // Round to 3 decimal places
                videoPath: paths.videoDB,
                thumbnailPath: paths.thumbnailDB,
                uuid: generateUUID(),
            },
        });
        res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "videoUploaded"));
    }
    catch (error) {
        throw new Error(prismaErrorHandler(error));
    }
});
//# sourceMappingURL=userController.js.map