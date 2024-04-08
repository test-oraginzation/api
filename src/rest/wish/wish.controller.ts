import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put, Query
} from "@nestjs/common";
import { AuthGuard } from '../auth/guards/auth.guard';
import { WishServiceRest } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('wishes')
@ApiTags('wishes')
export class WishController {
  constructor(private readonly wishServiceRest: WishServiceRest) {}

  @Get('search')
  search(@Query('query') query: string) {
    return this.wishServiceRest.search(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(@Request() req, @Body() data: CreateWishDto) {
    return this.wishServiceRest.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.wishServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findAllByUserId(@Request() req) {
    return this.wishServiceRest.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findOneByUserId(@Request() req, @Param() id: number) {
    return this.wishServiceRest.getOneByUserID(req.user.id, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateWishDto,
  ) {
    return this.wishServiceRest.update(req.user.id, +id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Request() req, @Param('id') id: string) {
    return this.wishServiceRest.delete(req.user.id, +id);
  }
}
