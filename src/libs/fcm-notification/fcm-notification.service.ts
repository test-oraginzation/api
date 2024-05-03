import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { IFcmNotificationService } from './typing/interfaces/fcm-notification.service.interface';

@Injectable()
export class FcmNotificationService implements IFcmNotificationService {
  constructor() {}

  async sendingNotificationOneUser(token: string) {
    const payload = {
      token: token,
      notification: {
        title: 'Hi there this is title',
        body: 'Hi there this is message',
      },
      data: {
        name: 'Joe',
        age: '21',
      },
    };
    return admin
      .messaging()
      .send(payload)
      .then((res) => {
        console.log(res);
        return {
          success: true,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          success: false,
        };
      });
  }
}
