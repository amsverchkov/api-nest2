import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import { Model } from 'mongoose';
import { FileElementResponse } from './dto/file-element.response';
import { MFile } from './dto/mfile.class';
import { SaveFilesDto } from './dto/save-files.dto';
import { FileDocument, FileModel } from './file-model';

@Injectable()
export class FilesService {
	constructor(@InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>) {}

	async saveFilesOnServer(files: MFile[]): Promise<FileElementResponse[]> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		const res: FileElementResponse[] = [];
		await ensureDir(uploadFolder);
		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push({
				url: `${uploadFolder}/${file.originalname}`,
				name: `${file.originalname}`,
			});
		}
		return res;
	}

	async saveFilesInfo(files: SaveFilesDto[]): Promise<FileModel[]> {
		return await this.fileModel.insertMany(files);
	}
}
