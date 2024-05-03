export interface IFcmNotificationService {
  sendingNotificationOneUser(token: string): Promise<{ success: boolean }>;
}
