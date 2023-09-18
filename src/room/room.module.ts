import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomController } from './room.controller';
import { RoomModel, RoomSchema } from './room.model';
import { RoomService } from './room.service';

@Module({
	controllers: [RoomController],
	imports: [
		MongooseModule.forFeature([
			{
				name: RoomModel.name,
				schema: RoomSchema,
			},
		]),
	],
	providers: [RoomService],
	exports: [RoomService],
})
export class RoomModule {}
