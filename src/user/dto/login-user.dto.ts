import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ example: 'alex@gmail.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @ApiProperty({ example: 'pass1234' })
  password: string;
}
