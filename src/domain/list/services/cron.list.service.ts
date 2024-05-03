import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ListsServiceDomain } from './list.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '../../../shared/events/typing/enums/event.enum';
import { ICronListService } from '../typing/interfaces/cron.list.service.interface';

@Injectable()
export class CronListService implements ICronListService {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Europe/Riga' })
  async checkListExpiry() {
    const lists = await this.listServiceDomain.findAll();
    const now = Date.now();
    const listsIds: number[] = [];
    for (const list of lists) {
      if (list.expireAt) {
        const expireAtTimestamp = new Date(list.expireAt).getTime();
        if (expireAtTimestamp <= now) {
          listsIds.push(list.id);
        }
      }
    }
    try {
      this.eventEmitter.emit(Events.onListExpired, { listIds: listsIds });
    } catch (e) {}
  }
}
