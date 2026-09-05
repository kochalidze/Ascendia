
import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.ts";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const session = await  auth.api.getSession({
		headers: fromNodeHeaders(req.headers)
	});

	if (!session) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	req.user = session.user;
	req.session = session.session;

	next();
}