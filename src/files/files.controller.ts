import { Body, Controller, HttpCode, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/file-element.response';
import { MFile } from './dto/mfile.class';
import { SaveFilesDto } from './dto/save-files.dto';
import { FilesResizeService } from './files-resize.service';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly filesResizeService: FilesResizeService,
	) {}

	@Post('upload')
	@HttpCode(200)
	@UseInterceptors(FilesInterceptor('files'))
	async upload(@UploadedFiles() files: Express.Multer.File[]): Promise<FileElementResponse[]> {
		const resizedFiles = await Promise.all(
			files.map(async (file) => {
				const convertedFileBuffer = await this.filesResizeService.resizeAndConvertToWebP(
					file.buffer,
				);
				const newName = file.originalname.split('.')[0] + '.webp';
				return new MFile({ originalname: newName, buffer: convertedFileBuffer });
			}),
		);
		return this.filesService.saveFilesOnServer(resizedFiles);
	}

	@Post('save')
	async saveFilesInDb(@Body() files: SaveFilesDto[]) {
		return this.filesService.saveFilesInfo(files);
	}
}
