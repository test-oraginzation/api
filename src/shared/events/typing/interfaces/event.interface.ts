export interface IEventsPayloads {
  onUserCreated: { userId: number };
  onListExpired: { listIds: number[] };
}
