import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowDto {
  @ApiProperty()
  following: number;
}

export class FollowDto {
  @ApiProperty()
  follower: number;
  @ApiProperty()
  following: number;
}
