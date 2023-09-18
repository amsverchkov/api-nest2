import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleController } from './schedule.controller';
import { ScheduleModel, ScheduleSchema } from './schedule.model';
import { ScheduleService } from './schedule.service';

@Module({
	controllers: [ScheduleController],
	imports: [
		MongooseModule.forFeature([
			{
				name: ScheduleModel.name,
				schema: ScheduleSchema,
			},
		]),
	],
	providers: [ScheduleService],
})
export class ScheduleModule {}
