import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FollowServiceRest } from './follow.service';

@Controller('follows')
@ApiTags('follows')
export class FollowController {
  constructor(private readonly followServiceRest: FollowServiceRest) {}

  @Get('')
  @ApiOperation({ summary: 'get all follows' })
  findAll() {
    return this.followServiceRest.getAll();
  }
}
