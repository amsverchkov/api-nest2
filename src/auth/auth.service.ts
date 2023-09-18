import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { AuthDto } from './dto/auth.dto';
import { UserDcoument, UserModel } from './user.model';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel.name) private userModel: Model<UserDcoument>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto): Promise<UserDcoument> {
		const salt = await genSalt(10);
		const password = await hash(dto.password, salt);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: password,
			name: dto.name,
			phone: dto.phone,
			role: dto.role,
		});
		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async validateUser(email: string, password: string): Promise<UserModel> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
		if (!(await compare(password, user.passwordHash))) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return user;
	}

	async login(email: string) {
		const token = await this.jwtService.signAsync({ email });
		return {
			access_token: token,
		};
	}
}
