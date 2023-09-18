import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { FileModel, FileSchema } from './file-model';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesResizeService } from './files-resize.service';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/static',
		}),
		MongooseModule.forFeature([
			{
				name: FileModel.name,
				schema: FileSchema,
			},
		]),
	],
	controllers: [FilesController],
	providers: [FilesService, FilesResizeService],
})
export class FilesModule {}
