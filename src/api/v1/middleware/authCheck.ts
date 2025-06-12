import { Request, Response, NextFunction } from "express";
import { JWTAuth } from "../utility/jwtAuth.js";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware to check if the user is logged in by verifying the JWT token.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*}
 */
export const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.TOKEN, "accessTokenNotFound"));
  } else {
    const accessToken = req.headers.authorization.split(" ")[1];
    const token = JWTAuth.verifyToken(accessToken);

    try {
      if (token?.status && typeof token.msg === "object" && "id" in token.msg) {
        const userId = parseInt(atob(token.msg.id));
        const getUser = await prisma.user.findFirst({ where: { id: userId } });

        if (!getUser) {
          res.status(StatusCodes.BAD_REQUEST).json(apiResponse(ResponseCategory.ERROR, "userNotFound"));
          return;
        }
        return next();
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json(apiResponse(ResponseCategory.TOKEN, token.msg as string, null));
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse(ResponseCategory.ERROR, "unexpectedError", error));
    }
  }
};
