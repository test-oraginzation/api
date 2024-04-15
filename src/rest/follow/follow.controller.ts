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
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FollowServiceRest } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';

@Controller('follows')
@ApiTags('follows')
export class FollowController {
  constructor(private readonly followServiceRest: FollowServiceRest) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiBody({ type: CreateFollowDto })
  @ApiResponse({ status: HttpStatus.OK, description: `Follow` })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Following user does not exist`,
  })
  @ApiOperation({ summary: 'Create follow' })
  create(@Request() req, @Body() data: CreateFollowDto) {
    return this.followServiceRest.create(req.user.id, data);
  }

  @Get('all')
  @ApiOperation({ summary: 'get all follows' })
  findAll() {
    return this.followServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get user followers` })
  findFollowers(@Request() req) {
    return this.followServiceRest.getFollowers(req.user.id);
  }

  @Get('find/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'Follower ID', type: 'number' })
  @ApiOperation({ summary: `Get user's follow by followId` })
  findFollower(@Request() req, @Param() id: number) {
    return this.followServiceRest.checkFollow(req.user.id, id);
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'Follow ID', type: 'number' })
  @ApiOperation({ summary: `Delete follow` })
  remove(@Request() req, @Param('id') id: string) {
    return this.followServiceRest.delete(req.user.id, +id);
  }
}
