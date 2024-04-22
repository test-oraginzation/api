import {
  Controller,
  Get,
  Body,
  Delete,
  UseGuards,
  Request,
  Query,
  Param,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserServiceRest } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { WishServiceRest } from '../wish/wish.service';
import { User } from '../../domain/user/entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly userServiceRest: UserServiceRest,
    private readonly minioService: MinioService,
    private readonly wishServiceRest: WishServiceRest,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    description: 'List of all users',
    status: HttpStatus.OK,
    type: User,
  })
  findAll() {
    return this.userServiceRest.getAll();
  }

  @Get('find/:id')
  @ApiOperation({ summary: 'Get one user by id' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  findOne(@Param('id') id: number) {
    return this.userServiceRest.getOne(id);
  }

  @Get(':id/wishes')
  @ApiOperation({ summary: `Get user's wishes by userid` })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  findUserWishes(@Param('id') id: number) {
    return this.wishServiceRest.getAllByUserId(id);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search query by name/surname/nickname',
    description: 'example: search?query=your_value',
  })
  @ApiQuery({
    name: 'query',
    description: 'Search query by name/surname/nickname',
    required: true,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Users not found' })
  search(@Query('query') name: string) {
    return this.userServiceRest.search(name);
  }

  @Get('upload-photo')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: 'Upload photo' })
  @ApiQuery({
    name: 'name',
    description: 'Send filename',
    required: true,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'url' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error!: send a file name',
  })
  getSignedUrl(@Request() req, @Query('name') name: string) {
    return this.minioService.getPresignedUserPhoto(req.user.id, name);
  }

  @Get('finish-upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: 'Finish upload photo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated user with photo',
  })
  finishUpload(@Request() req) {
    return this.userServiceRest.updatePhoto(req.user.id);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user data' })
  @ApiBearerAuth('Access token')
  @ApiResponse({ status: HttpStatus.OK, description: 'User' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  findMe(@Request() req) {
    return this.userServiceRest.getOne(req.user.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({
    summary: 'Update user',
    description: 'You can send ANY PROPERTY to update',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'User' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Send some data to update',
  })
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userServiceRest.update(req.user.id, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Just send bearer token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User with id: ${id} successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  remove(@Request() req) {
    return this.userServiceRest.delete(req.user.id);
  }
}
