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
import { apiResponse } from "../../utility/helper.js";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utility/prismaErrorHandler.js";
/**
 * DashboardController class handles dashboard related operations
 *
 * @export
 * @class DashboardController
 */
export class DashboardController {
}
_a = DashboardController;
/**
 * Handles dashboard data fetching
 *
 * @static
 * @param {Request} req
 * @param {Response} res
 * @type {RequestHandler}
 * @memberof DashboardController
 */
DashboardController.dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new PrismaClient();
        const [category, likes, report, comment, user, blockedUsers, deletedUsers, creator, totalVideos, videoStats,] = yield Promise.all([
            prisma.category.count(),
            prisma.likes.count(),
            prisma.report.count(),
            prisma.comment.count(),
            prisma.user.count({ where: { isAdmin: false } }),
            prisma.user.count({
                where: {
                    isBlock: true,
                    isAdmin: false,
                },
            }),
            prisma.user.count({
                where: {
                    deletedAt: { not: null },
                    isAdmin: false,
                },
            }),
            prisma.user.count({
                where: {
                    channelName: {
                        not: null,
                    },
                    isAdmin: false,
                },
            }),
            prisma.video.count(),
            prisma.video.aggregate({
                _sum: {
                    viewCount: true,
                },
            }),
        ]);
        const dashboardData = {
            category,
            likes,
            report,
            comment,
            user,
            blockedUsers,
            deletedUsers,
            creator,
            totalVideos,
            totalVideoViews: Number(videoStats._sum.viewCount),
        };
        res
            .status(StatusCodes.OK)
            .json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", safeJson(dashboardData)));
    }
    catch (error) {
        throw new Error(prismaErrorHandler(error));
    }
});
//# sourceMappingURL=dashboardController.js.map