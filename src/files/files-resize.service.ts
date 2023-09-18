import { Injectable } from '@nestjs/common';
import sizeof from 'image-size';
import * as sharp from 'sharp';
import { MFile } from './dto/mfile.class';

@Injectable()
export class FilesResizeService {
	async resizeFewAndConvertToWebP(files: Express.Multer.File[]) {
		return await Promise.all(
			files.map(async (file) => {
				const convertedFileBuffer = await this.resizeAndConvertToWebP(file.buffer);
				const newName = file.originalname.split('.')[0] + '.webp';
				return new MFile({ originalname: newName, buffer: convertedFileBuffer });
			}),
		);
	}

	async resizeAndConvertToWebP(file: Buffer) {
		const { width, height } = sizeof(file);
		const newWidth = 500;
		const coefficient = width / newWidth;
		const newHeight = Math.round(height / coefficient);
		return sharp(file).resize(newWidth, newHeight).webp().toBuffer();
	}
}
