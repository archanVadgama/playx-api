import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utility/prismaErrorHandler.js";
import "dotenv/config";

const prisma = new PrismaClient();
const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV;

// under development
export class UserController {
  /**
   * @description Get user by id
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @type {RequestHandler}
   * @memberof UserController
   */
  static readonly getUser: RequestHandler = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidUserId"));
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        omit: { password: true },
        where: { id: userId, isAdmin: false, deletedAt: null },
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", safeJson(user)));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  static readonly getAllUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { search, sort } = req.query;
      const sortOrder = sort === "desc" ? "desc" : "asc";

      const user = await prisma.user.findMany({
        omit: { password: true },
        where: {
          isAdmin: false,
          deletedAt: null,
          username: search ? { contains: search as string, mode: "insensitive" } : undefined,
        },
        orderBy: {
          mobileNumber: sortOrder,
        },
      });
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "dataFetched", safeJson(user)));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  static readonly deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidUserId"));
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        omit: { password: true },
        where: { id: userId, isAdmin: false },
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
        },
      });

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "userDeleted"));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  static readonly restoreUser: RequestHandler = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidUserId"));
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        omit: { password: true },
        where: { id: userId, isAdmin: false },
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: null,
        },
      });
      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "userRestore"));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };

  static readonly updateUser: RequestHandler = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          apiResponse(
            ResponseCategory.ERROR,
            "validationFailed",
            result.formatWith((msg) => msg.msg).mapped()
          )
        );
      return;
    }

    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "invalidUserId"));
      return;
    }

    const {
      username,
      displayName,
      channelName,
      bio,
      email,
      mobileNumber,
      password,
      landmark,
      addressLine1,
      addressLine2,
    } = req.body;

    logHttp("info", req.body);

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId, isAdmin: false },
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
        return;
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          username,
          displayName,
          channelName,
          bio,
          email,
          mobileNumber,
          password,
          landmark,
          addressLine1,
          addressLine2,
        },
      });

      res.status(StatusCodes.OK).json(apiResponse(ResponseCategory.SUCCESS, "userUpdated"));
    } catch (error) {
      throw new Error(prismaErrorHandler(error as IPrismaError));
    }
  };
}
