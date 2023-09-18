import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<FileModel>;

@Schema()
export class FileModel {
	@Prop()
	name: string;
	@Prop()
	url: string;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
