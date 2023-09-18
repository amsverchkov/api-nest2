import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { getJWTConfig } from './common/configs/jwt.config';
import { getMongoConfig } from './common/configs/mongo.config';
import { getTelegramConfig } from './common/configs/telegram.config';
import { FilesModule } from './files/files.module';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		ScheduleModule,
		RoomModule,
		AuthModule,
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		FilesModule,
		SitemapModule,
		TelegramModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTelegramConfig,
		}),
	],
	exports: [JwtModule],
})
export class AppModule {}
