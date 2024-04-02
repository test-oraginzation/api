import { Controller, Get, Query } from '@nestjs/common';
import { MinioService } from './services/minio.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('files')
@ApiTags('files')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('signed-url')
  getSignedUrl(@Query('name') name: string) {
    return this.minioService.getPresignedUrl(name);
  }

  @Get('test')
  getPhoto(@Query('name') name: string) {
    return this.minioService.getPhoto(name);
  }
}
