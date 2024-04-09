import {
  Controller,
  Get,
  Body,
  Delete,
  UseGuards,
  Request,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserServiceRest } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userServiceRest: UserServiceRest) {}

  @Get()
  findAll() {
    return this.userServiceRest.getAll();
  }

  @Get('search')
  search(@Query('query') name: string) {
    return this.userServiceRest.search(name);
  }

  @Get('/profile')
  findOne(@Param('id') id: number) {
    return this.userServiceRest.getOne(id);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findMe(@Request() req) {
    return this.userServiceRest.getOne(req.user.id);
  }

  @Put()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userServiceRest.update(req.user.id, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Request() req) {
    return this.userServiceRest.delete(req.user.id);
  }
}
