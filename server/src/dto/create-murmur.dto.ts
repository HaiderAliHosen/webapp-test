import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMurmurDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280) // Twitter-like character limit
  content: string;
}