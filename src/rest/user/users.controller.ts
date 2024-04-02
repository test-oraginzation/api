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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserServiceRest } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userServiceRest: UserServiceRest) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userServiceRest.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userServiceRest.getAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  findOne(@Request() req) {
    return this.userServiceRest.getOne(req.user.id);
  }

  @Put()
  @UseGuards(AuthGuard)
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userServiceRest.update(req.user.id, updateUserDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userServiceRest.delete(+id);
  }
}
