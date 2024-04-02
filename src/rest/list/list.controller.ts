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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('lists')
@ApiTags('lists')
export class ListController {
  constructor(private readonly listServiceRest: ListServiceRest) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(@Request() req, @Body() data: CreateListDto) {
    return this.listServiceRest.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.listServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findAllByUserId(@Request() req) {
    return this.listServiceRest.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOneByUserId(@Request() req, @Param() id: string) {
    return this.listServiceRest.getOneByUserID(req.user.id, +id);
  }

  @Get('/all/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOne(@Param() id: number) {
    return this.listServiceRest.getOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  update(@Request() req, @Param('id') id: string, @Body() data: UpdateListDto) {
    return this.listServiceRest.update(req.user.id, +id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Request() req, @Param('id') id: string) {
    return this.listServiceRest.delete(req.user.id, +id);
  }
}
