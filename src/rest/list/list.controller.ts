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
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() data: CreateListDto) {
    return this.listService.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.listService.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllByUserId(@Request() req) {
    return this.listService.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOneByUserId(@Request() req, @Param() id: string) {
    return this.listService.getOneByUserID(req.user.id, +id);
  }

  @Get('/all/:id')
  @UseGuards(AuthGuard)
  findOne(@Param() id: number) {
    return this.listService.getOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listService.delete(+id);
  }
}
