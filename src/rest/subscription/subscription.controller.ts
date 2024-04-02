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
import { SubscriptionServiceRest } from './subscription.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionServiceRest: SubscriptionServiceRest,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() data: CreateSubscriptionDto) {
    return this.subscriptionServiceRest.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.subscriptionServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  findSubscribers(@Request() req) {
    return this.subscriptionServiceRest.getSubscribers(req.user.id);
  }

  // @Get('/all/:id')
  // @UseGuards(AuthGuard)
  // findOne(@Param() id: number) {
  //   return this.listService.getOne(id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionServiceRest.delete(+id);
  }
}
