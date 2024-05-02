export interface ICronListService {
  checkListExpiry(): Promise<void>;
}
