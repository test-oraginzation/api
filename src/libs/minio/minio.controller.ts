import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './services/minio.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../rest/auth/guards/auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
@Controller('files')
@ApiTags('files')
@UseInterceptors(CacheInterceptor)
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('presigned')
  @UseGuards(AuthGuard)
  getSignedUrl(@Request() req, @Query('name') name: string) {
    return this.minioService.getPresignedUrl(req.user.id, name);
  }

  @Get('finish')
  @UseGuards(AuthGuard)
  finishUpload(@Request() req) {
    return this.minioService.finishUpload(req.user.id);
  }

  @Get('signed-update')
  getUpdateSignedUrl(@Query('name') name: string) {
    return this.minioService.updatePhoto(name);
  }
}
