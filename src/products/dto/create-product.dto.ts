import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    @ApiProperty({example: "Palov"})
    name: string;

    @IsNumber()
    @Min(100)
    @ApiProperty({example: 28000})
    price: number;


    @ApiProperty({example: '0.1251531535-image.palov.png'})
    image: string;
}
