import { Module } from '@nestjs/common';
import { RoomModule } from 'src/room/room.module';
import { SitemapController } from './sitemap.controller';

@Module({
	controllers: [SitemapController],
	imports: [RoomModule],
})
export class SitemapModule {}
