import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserServiceRest } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userServiceRest: UserServiceRest) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userServiceRest.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userServiceRest.getAll();
  }

  @Get('search')
  search(@Query('query') name: string) {
    return this.userServiceRest.search(name);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOne(@Request() req) {
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
