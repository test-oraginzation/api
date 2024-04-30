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
  Put,
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
  CreateListDto,
  UpdateListDto,
  UpdateWishesInListDto,
  UserListWishDto,
} from './dto/list.dto';
import { IPagination } from "../../shared/pagination/pagination.interface";

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
    type: CreateListDto,
    description: 'Wish name, description required ',
  })
  @ApiOperation({ summary: 'Create list' })
  @ApiResponse({ status: HttpStatus.OK, description: `Created list` })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `All fields are required`,
  })
  create(@Request() req, @Body() data: CreateListDto) {
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
  @ApiQuery({
    name: 'limit',
    description: 'Count of lists o response',
    required: false,
    example: 2,
  })
  @ApiQuery({
    name: 'sort',
    description: 'Sort lists by ASC or DESC',
    required: false,
    example: 'ASC',
  })
  findAllByUserId(@Request() req, @Query() params: IPagination) {
    return this.listServiceRest.getAllByUserId(req.user.id, params);
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
  @ApiOperation({
    summary: 'Update list',
    description: 'You can send any property to update list',
  })
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
    return this.listServiceRest.updateList(req.user.id, +id, data);
  }

  @Put(':id/wishes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({
    summary: 'Update wishes in list',
    description: 'Send ALL wishes in list, not new',
  })
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
  @ApiOperation({ summary: 'Delete list' })
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
    return this.listServiceRest.delete(req.user.id, +id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all lists' })
  findAll() {
    return this.listServiceRest.getAll();
  }

  @Get(':id/upload-photo')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: 'Upload photo' })
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

  @Get(':id/finish-upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: 'Finish upload photo' })
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `Updated list` })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `List not found` })
  finishUpload(@Request() req, @Param('id') id: number) {
    return this.listServiceRest.updatePhoto(req.user.id, id);
  }
}
