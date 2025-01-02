// import { Request, Response, NextFunction } from "express";
// import * as jwt from "jsonwebtoken";


// export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if(!token) return res.status(403).json({  message: 'No token provided' });
//     const jwtPayload = <any>jwt.verify(token, process.env.JWTSECRETKEY);
//     console.log('=================?',jwtPayload)
//     res.locals.jwtPayload = jwtPayload;
//     next();
//   } catch (error) {
//     return res.status(403).json({  message: 'Invalid token' });
//   }
// };