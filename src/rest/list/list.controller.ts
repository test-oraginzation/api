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
import { AuthGuard } from '../auth/guards/auth.guard';
import { ListServiceRest } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('lists')
export class ListController {
  constructor(private readonly listServiceRest: ListServiceRest) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() data: CreateListDto) {
    return this.listServiceRest.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.listServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllByUserId(@Request() req) {
    return this.listServiceRest.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOneByUserId(@Request() req, @Param() id: string) {
    return this.listServiceRest.getOneByUserID(req.user.id, +id);
  }

  @Get('/all/:id')
  @UseGuards(AuthGuard)
  findOne(@Param() id: number) {
    return this.listServiceRest.getOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Request() req, @Param('id') id: string, @Body() data: UpdateListDto) {
    return this.listServiceRest.update(req.user.id, +id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listServiceRest.delete(+id);
  }
}
