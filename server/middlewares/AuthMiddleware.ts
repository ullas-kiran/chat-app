import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (request: any, response: any, next: NextFunction): void => {
    const token = request.cookies.jwt;
    if (!token) {
        return response.status(401).send("You are not authorized");
    }

    jwt.verify(token, process.env.JWT_KEY as string, async (error:any, payload:any) => {
        if (error) {
            return response.status(403).send("Token is not valid");
        }
        request.userId=payload.userId;
        next();
    });
};
