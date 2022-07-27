import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortDto {
  @ApiProperty({ default: 'Florida Port' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ default: 'Miami' })
  @IsString()
  @IsOptional()
  location?: string;
}
