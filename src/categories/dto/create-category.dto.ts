import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'category name must be at least 3 characters long' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
