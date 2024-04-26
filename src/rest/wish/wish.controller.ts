import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  Query,
  HttpStatus, Patch
} from "@nestjs/common";
import { AuthGuard } from '../auth/guards/auth.guard';
import { WishServiceRest } from './wish.service';
import { CreateWishDto, WishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MinioService } from '../../libs/minio/services/minio.service';

@Controller('wishes')
@ApiTags('wishes')
export class WishController {
  constructor(
    private readonly wishServiceRest: WishServiceRest,
    private readonly minioService: MinioService,
  ) {}

  @Get('search')
  @ApiQuery({
    name: 'query',
    description: 'Search query by wish name',
    required: true,
  })
  @ApiOperation({ summary: 'Search wish' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wishes',
    type: WishDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wishes not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Send data to search',
  })
  search(@Query('query') query: string) {
    return this.wishServiceRest.search(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiBody({ type: CreateWishDto })
  @ApiOperation({ summary: 'Create wish' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created wish',
    type: CreateWishDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Send data to create',
  })
  create(@Request() req, @Body() data: CreateWishDto) {
    return this.wishServiceRest.create(req.user.id, data);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all wishes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All wishes' })
  findAll() {
    return this.wishServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get all user's wishes` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: `User's wishes`,
    type: WishDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wishes not found',
  })
  findAllByUserId(@Request() req) {
    return this.wishServiceRest.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: 'Get one wish by id' })
  @ApiParam({ name: 'id', description: 'Wish ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `Wish`, type: WishDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wish not found',
  })
  findOneByUserId(@Request() req, @Param('id') id: string) {
    return this.wishServiceRest.getOneByUserID(req.user.id, +id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: 'Update wish' })
  @ApiParam({ name: 'id', description: 'Wish ID', type: 'number' })
  @ApiBody({ type: UpdateWishDto })
  @ApiResponse({ status: HttpStatus.OK, description: `Updated wish` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wish not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Send data to update wish',
  })
  update(@Request() req, @Param('id') id: string, @Body() updateUserDto: UpdateWishDto) {
    return this.wishServiceRest.update(req.user.id, +id, updateUserDto);
  }

  @Get(':id/upload-photo')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload photo' })
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'Wish ID', type: 'number' })
  @ApiQuery({
    name: 'name',
    description: 'Send filename, example: my-photo.jpg',
    required: true,
  })
  @ApiResponse({ status: HttpStatus.OK, description: `url`, type: 'string' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error: Send a file name!',
  })
  getSignedUrl(@Param('id') id: number, @Query('name') name: string) {
    return this.minioService.getPresignedWishPhoto(id, name);
  }

  @Get(':id/finish-upload')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Finish upload photo' })
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'Wish id', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `Updated wish` })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Wish not found` })
  finishUpload(@Request() req, @Param('id') id: number) {
    return this.wishServiceRest.updatePhoto(req.user.id, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete wish' })
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'Wish id', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `Success` })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Wish not found` })
  remove(@Request() req, @Param('id') id: string) {
    return this.wishServiceRest.delete(req.user.id, +id);
  }
}
