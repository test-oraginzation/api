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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionServiceRest: SubscriptionServiceRest,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(@Request() req, @Body() data: CreateSubscriptionDto) {
    return this.subscriptionServiceRest.create(req.user.id, data);
  }

  @Get('all')
  findAll() {
    return this.subscriptionServiceRest.getAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  findSubscribers(@Request() req) {
    return this.subscriptionServiceRest.getSubscribers(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionServiceRest.delete(+id);
  }
}
