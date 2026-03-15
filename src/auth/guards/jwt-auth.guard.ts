import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization as string | undefined;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('Missing or invalid bearer token');
		}

		const token = authHeader.slice(7).trim();

		if (!token) {
			throw new UnauthorizedException('Missing or invalid bearer token');
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SECRET || 'your-secret-key',
			});
			request.user = payload;
			return true;
		} catch {
			throw new UnauthorizedException('Invalid or expired token');
		}
	}
}
