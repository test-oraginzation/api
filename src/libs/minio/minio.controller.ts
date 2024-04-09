import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { MinioService } from './services/minio.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../rest/auth/guards/auth.guard';

@Controller('files')
@ApiTags('files')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('signed-create')
  @UseGuards(AuthGuard)
  getSignedUrl(@Request() req, @Query('name') name: string) {
    return this.minioService.getPresignedUrl(req.user.id, name);
  }

  @Get('test')
  getPhoto(@Query('name') name: string) {
    return this.minioService.getPhoto(name);
  }

  @Get('signed-update')
  getUpdateSignedUrl(@Query('name') name: string) {
    return this.minioService.updatePhoto(name);
  }
}
