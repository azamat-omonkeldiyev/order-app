import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  @ApiProperty({ example: '68012bde7b2a4009c8b7cc72' })
  user: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @ApiProperty({
    example: ['68012bde7b2a4009c8b7cc72', '68012bcd7b2a4009c8b7cc6c'],
    type: [String],
  })
  products: string[];
}
