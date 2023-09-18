import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { FileModel } from 'src/files/file-model';

export enum RoomType {
	Standard = 'Standard',
	StandardImproved = 'Standard improved',
	Lux = 'Lux',
}

export type RoomDocument = HydratedDocument<RoomModel>;

@Schema()
export class RoomModel {
	@Prop({ required: true })
	number: number;
	@Prop({ required: true })
	type: RoomType;
	@Prop({ type: [{ type: MSchema.Types.ObjectId, ref: RoomModel.name }] })
	file: FileModel[];
}

const RoomSchema = SchemaFactory.createForClass(RoomModel);
RoomSchema.index({ number: 1, type: 1 }, { unique: true });
export { RoomSchema };
