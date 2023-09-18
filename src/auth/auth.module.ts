import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel, UserSchema } from './user.model';

@Global()
@Module({
	providers: [AuthService, ConfigService],
	imports: [
		MongooseModule.forFeature([
			{
				schema: UserSchema,
				name: UserModel.name,
			},
		]),
		PassportModule,
		ConfigModule,
	],
	controllers: [AuthController],
	exports: [AuthService, ConfigService],
})
export class AuthModule {}
