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
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ListServiceRest } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('lists')
@ApiTags('lists')
export class ListController {
  constructor(private readonly listServiceRest: ListServiceRest) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiBody({
    type: CreateListDto,
    description: 'Wish name, description required ',
  })
  @ApiOperation({ summary: 'Create list' })
  @ApiResponse({ status: HttpStatus.OK, description: `Created list` })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `All fields are required`,
  })
  create(@Request() req, @Body() data: CreateListDto) {
    return this.listServiceRest.create(req.user.id, data);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get all user's lists` })
  @ApiResponse({ status: HttpStatus.OK, description: `User's lists` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `Lists not found`,
  })
  findAllByUserId(@Request() req) {
    return this.listServiceRest.getAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiOperation({ summary: `Get user's list by id` })
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `User's list` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `List not found`,
  })
  findOneByUserId(@Request() req, @Param('id') id: string) {
    return this.listServiceRest.getOneByUserID(req.user.id, +id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiBody({ type: UpdateListDto })
  @ApiResponse({ status: HttpStatus.OK, description: `User's updated list` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `List not found`,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Send some data to update`,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `List not yours`,
  })
  update(@Request() req, @Param('id') id: string, @Body() data: UpdateListDto) {
    return this.listServiceRest.updateList(req.user.id, +id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Access token')
  @ApiParam({ name: 'id', description: 'List id', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: `User's updated list` })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `List not found`,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `List not yours`,
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.listServiceRest.delete(+id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all lists' })
  findAll() {
    return this.listServiceRest.getAll();
  }
}
