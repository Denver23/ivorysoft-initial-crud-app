import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVesselDto {
  @ApiProperty({ default: 'Marina' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ default: 'Small' })
  @IsString()
  @IsOptional()
  size?: string;
}
