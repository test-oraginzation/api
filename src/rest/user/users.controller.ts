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
  Post,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserServiceRest } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MinioService } from '../../libs/minio/services/minio.service';
import { WishServiceRest } from '../wish/wish.service';
import { User } from '../../domain/user/entities/user.entity';
import { FollowServiceRest } from '../follow/follow.service';
import { CreateFollowDto, FollowDto } from '../follow/dto/create-follow.dto';
import { IPagination } from "../../shared/pagination.interface";

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly userServiceRest: UserServiceRest,
    private readonly minioService: MinioService,
    private readonly wishServiceRest: WishServiceRest,
    private readonly followServiceRest: FollowServiceRest,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    description: 'List of all users',
    status: HttpStatus.OK,
    type: User,
  })
  findAll(@Query() params: IPagination) {
    return this.userServiceRest.getAll(params);
  }

  @Get(':id')
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
  findUserWishes(@Param('id') id: number, @Query() params: IPagination) {
    return this.wishServiceRest.getAllByUserId(id, params);
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

  @Get('followings')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get user followings` })
  @ApiResponse({ status: HttpStatus.OK, description: 'Following user list' })
  findFollowings(@Request() req) {
    return this.followServiceRest.getFollowing(req.user.id);
  }

  @Get('followers')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get user followers` })
  @ApiResponse({ status: HttpStatus.OK, description: 'Followers user list' })
  findFollowers(@Request() req) {
    return this.followServiceRest.getFollowers(req.user.id);
  }

  @Get(':id/followings')
  @ApiOperation({ summary: `Get user followings` })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Following users list' })
  findFollowingsByUserId(@Param('id') id: string) {
    return this.followServiceRest.getFollowing(+id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: `Get user followers` })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Followers users list' })
  findFollowersByUserId(@Param('id') id: string) {
    return this.followServiceRest.getFollowers(+id);
  }

  @Post('/followings')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiBody({ type: CreateFollowDto })
  @ApiResponse({ status: HttpStatus.OK, description: `Follow` })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Following user does not exist`,
  })
  @ApiOperation({ summary: 'Create following' })
  create(@Request() req, @Body() data: CreateFollowDto) {
    return this.followServiceRest.create(req.user.id, data);
  }

  @Get('/followers-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get user's followers` })
  @ApiOkResponse({ description: 'Count' })
  findFollowersCount(@Request() req) {
    return this.followServiceRest.getFollowersCount(req.user.id);
  }

  @Get('/following-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get user's following` })
  @ApiOkResponse({ description: 'Count' })
  findFollowingCount(@Request() req) {
    return this.followServiceRest.getFollowingCount(req.user.id);
  }

  @Get('followings/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'Following ID', type: 'number' })
  @ApiOperation({ summary: `Get user's follow by followId` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returning follow',
    type: FollowDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  findFollower(@Param('id') id: string) {
    return this.followServiceRest.checkFollow(+id);
  }

  @Delete('/followings/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({
    name: 'id',
    description: 'User who following ID',
    type: 'number',
  })
  @ApiOperation({ summary: `Delete following` })
  removeFollowing(@Request() req, @Param('id') id: string) {
    return this.followServiceRest.delete(req.user.id, +id);
  }

  @Get('logs')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: `get all user's logs` })
  @ApiResponse({ status: HttpStatus.OK, description: `json with logs` })
  getLogs(@Request() req) {
    return this.userServiceRest.getLogs(req.user.id);
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
