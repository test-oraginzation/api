export interface RedisServiceInterface {
  cacheUserPhotoNameData(userId: number, value: string): Promise<boolean>;
  cacheWishPhotoNameData(wishId: number, value: string): Promise<boolean>;
  cacheListPhotoNameData(listId: number, value: string): Promise<boolean>;
  getUserPhotoName(userId: number): Promise<string>;
  getWishPhotoName(wishId: number): Promise<string>;
  getListPhotoName(listId: number): Promise<string>;
  checkConnection(): Promise<boolean>;
}
