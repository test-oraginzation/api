export interface MinioServiceInterface {
  getPresignedUserPhoto(userId: number, name: string): Promise<{ url: string }>;
  getPresignedWishPhoto(wishId: number, name: string): Promise<{ url: string }>;
  getPresignedListPhoto(listId: number, name: string): Promise<{ url: string }>;
  getPhoto(name: string): Promise<string>;
}
