import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Product name must be at least 2 characters long.' })
  name!: string;
  @IsNumber()
  @IsPositive()
  price!: number;
  @IsInt()
  @IsPositive()
  stock!: number;
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  categoryId!: string;
}
