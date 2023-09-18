import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		const payload = await this.jwtService.verifyAsync(token, {
			secret: this.configService.get('JWT_SECRET'),
		});

		request['user'] = await this.authService.findUser(payload.email);
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		// @ts-ignore
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
