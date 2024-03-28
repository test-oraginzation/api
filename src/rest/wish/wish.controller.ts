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
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';

@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() data: CreateWishDto) {
    return this.wishService.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.wishService.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllByUserId(@Request() req) {
    return this.wishService.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param() id: number) {
    return this.wishService.getOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishService.delete(+id);
  }
}
