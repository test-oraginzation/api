import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FollowServiceRest } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';

@Controller('follows')
@ApiTags('follows')
export class FollowController {
  constructor(private readonly followServiceRest: FollowServiceRest) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(@Request() req, @Body() data: CreateFollowDto) {
    return this.followServiceRest.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.followServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findFollowers(@Request() req) {
    return this.followServiceRest.getFollowers(req.user.id);
  }

  // @Get(':id')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // findFollower(@Request() req, @Param() id: number) {
  //   return this.followServiceRest.checkFollow(req.user.id, id);
  // }

  @Get('/followers-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findFollowersCount(@Request() req) {
    return this.followServiceRest.getFollowersCount(req.user.id);
  }

  @Get('/following-count')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findFollowingCount(@Request() req) {
    return this.followServiceRest.getFollowingCount(req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Request() req, @Param('id') id: string) {
    return this.followServiceRest.delete(req.user.id, +id);
  }
}
