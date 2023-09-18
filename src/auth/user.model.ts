import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDcoument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
	@Prop({ required: true })
	email: string;
	@Prop({ required: true })
	passwordHash: string;
	@Prop({ required: true })
	name: string;
	@Prop({ required: true })
	phone: number;
	@Prop({ required: true })
	role: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
