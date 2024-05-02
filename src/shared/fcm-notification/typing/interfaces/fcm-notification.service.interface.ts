export interface FcmNotificationServiceInterface {
  sendingNotificationOneUser(token: string): Promise<{ success: boolean }>;
}
