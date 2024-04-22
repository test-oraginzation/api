import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ListServiceRest } from './list.service';
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
import {
  UpdateListDto,
  UpdateWishesInListDto,
  UserListWishDto,
} from './dto/list.dto';

@Controller('lists')
@ApiTags('lists')
export class ListController {
  constructor(
    private readonly listServiceRest: ListServiceRest,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiBody({
    type: UserListWishDto,
    description: 'Wish name, description required ',
  })
  @ApiOperation({ summary: 'Create list' })
  @ApiResponse({ status: HttpStatus.OK, description: `Created list` })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `All fields are required`,
  })
  create(@Request() req, @Body() data: UserListWishDto) {
    return this.listServiceRest.create(req.user.id, data);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get all user's lists` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: `User's lists`,
    type: UserListWishDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Lists not found`,
  })
  findAllByUserId(@Request() req) {
    return this.listServiceRest.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get user's list by id` })
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: `User's list`,
    type: UserListWishDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `List not found`,
  })
  findOneByUserId(@Request() req, @Param('id') id: string) {
    return this.listServiceRest.getOneByUserID(req.user.id, +id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiBody({ type: UpdateListDto })
  @ApiResponse({ status: HttpStatus.OK, description: `User's updated list` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `List not found`,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Send some data to update`,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `List not yours`,
  })
  update(@Request() req, @Param('id') id: string, @Body() data: UpdateListDto) {
    return this.listServiceRest.updateList(+id, data);
  }

  @Patch(':id/wishes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiBody({ type: UpdateWishesInListDto })
  @ApiResponse({ status: HttpStatus.OK, description: `User's updated list` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `List not found`,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Send some data to update`,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `List not yours`,
  })
  updateWishes(
    @Request() req,
    @Param('id') id: string,
    @Body() data: UpdateWishesInListDto,
  ) {
    return this.listServiceRest.updateWishesInList(req.user.id, +id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `User's updated list` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `List not found`,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `List not yours`,
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.listServiceRest.delete(+id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all lists' })
  findAll() {
    return this.listServiceRest.getAll();
  }

  @Get(':id/upload-photo')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'List ID', type: 'number' })
  @ApiQuery({
    name: 'name',
    description: 'Send filename, example: my-photo.jpg',
    required: true,
  })
  @ApiResponse({ status: HttpStatus.OK, description: `url` })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error: Send a file name!',
  })
  getSignedUrl(@Param('id') id: number, @Query('name') name: string) {
    return this.minioService.getPresignedListPhoto(id, name);
  }

  @Get(':id/finish')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `Updated list` })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `List not found` })
  finishUpload(@Request() req, @Param('id') id: number) {
    return this.listServiceRest.updatePhoto(id);
  }
}
