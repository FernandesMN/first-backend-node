import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
	iat: number,
	exp: number,
	sub: string
}

export default function ensureAutheticated (request: Request, 
	response: Response, 
	next: NextFunction
): void {

	const { headers: { authorization } } = request;

	const authHeader = authorization;

	if(!authHeader) {
		throw new Error('JWT token is missing.');
	}

	const [, token] = authHeader.split(' ');

	const { secret } = authConfig.jwt;

	try {
		const decoded = verify(token, secret);

		const { sub } = decoded as TokenPayload;

		request.user = {
			id: sub
		};

		return next();
	} catch(err) {
		throw new Error('Invalid JWT token');
	}
}