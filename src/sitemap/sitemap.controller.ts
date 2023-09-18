import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addDays, format } from 'date-fns';
import { RoomService } from 'src/room/room.service';
import { Builder } from 'xml2js';

@Controller('sitemap')
export class SitemapController {
	domain: string;

	constructor(
		private readonly roomService: RoomService,
		private readonly configService: ConfigService,
	) {
		this.domain = this.configService.get('DOMAIN') ?? 'domain';
	}

	@Get('xml')
	@Header('Content-type', 'text-xml')
	sitemap() {
		const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";
		const res = [
			{
				loc: `${this.domain}`,
				lastmod: format(addDays(new Date(), -1), formatString),
				changefreq: 'daily',
				priority: '1.0',
			},
		];
		const builder = new Builder({
			xmldec: { version: '1.0', encoding: 'UTF-8' },
		});
		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'https://www.sitemaps.org/schemas/sitemap/0.9/',
				},
				url: res,
			},
		});
	}

	@Get('findAllRooms')
	async findAll() {
		return await this.roomService.findAll();
	}
}
