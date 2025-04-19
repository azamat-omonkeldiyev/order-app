import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { Role } from '../enam/role.enum';
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex' })
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'alex@gmail.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @ApiProperty({ example: 'pass1234' })
  password: string;

  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role: Role;
}
