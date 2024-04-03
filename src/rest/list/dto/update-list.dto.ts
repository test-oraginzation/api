import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateListDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  photo?: string;

  @ApiPropertyOptional()
  private?: boolean;
  wishesIds?: number[];
}