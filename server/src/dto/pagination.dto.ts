import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;  // Default value

  @IsOptional()
  @IsNumber()
  @Min(1)
  // @Max(100)
  limit?: number = 10;
}
