// import { Request, Response, NextFunction } from "express";
// import { auth } from "../lib/auth.ts";
// import { fromNodeHeaders } from "better-auth/node";
// import { wrap } from '../lib/helpers.ts';

// export const authMiddleware = wrap(async (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = await auth.api.getSession({
//         headers: fromNodeHeaders(req.headers)
//     });
//     if (!authHeader) throw new Error("Authorization header missing"); // TODO: replace with proper error handling

//     req.user = authHeader.user;
//     req.session = authHeader.session; 

//     next();
// });
