import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { RoomModel } from '../room/room.model';

export type ScheduleDocument = HydratedDocument<ScheduleModel>;

@Schema()
export class ScheduleModel {
	@Prop({ type: MSchema.Types.ObjectId, ref: RoomModel.name })
	room: RoomModel;
	@Prop({ type: Date })
	day: Date;
	@Prop({ text: true })
	comment: string;
}

const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
ScheduleSchema.index({ room: 1, day: 1 }, { unique: true });
export { ScheduleSchema };
