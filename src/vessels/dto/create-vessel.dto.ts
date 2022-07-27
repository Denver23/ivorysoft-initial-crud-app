import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVesselDto {
  @ApiProperty({ default: 'Teresa' })
  @IsString()
  name: string;

  @ApiProperty({ default: 'large' })
  @IsString()
  size: string;
}
