import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Regency, RegencyTypeEnum } from '../domain/regency';

export class FilterRegencyDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  provinceId?: Regency['provinceId'];

  @ApiPropertyOptional({ enum: RegencyTypeEnum })
  @IsOptional()
  @IsEnum(RegencyTypeEnum)
  type?: RegencyTypeEnum;
}

export class SortRegencyDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Regency;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryRegencyDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  })
  @Type(() => FilterRegencyDto)
  filters?: FilterRegencyDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  })
  @Type(() => SortRegencyDto, { each: true })
  sort?: SortRegencyDto[] | null;
}