import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class CategoryQuery extends PaginationDto {
  @IsArray()
  @IsString({each: true})
  @ArrayNotEmpty()
  @Transform(({value}) => (Array.isArray(value) ? value : [value]))
  @ApiProperty()
  categories: string[] = [];
}

export class SearchCategoryQuery extends PaginationDto {
  @IsString()
  @ApiPropertyOptional()
  search: string = ""; // empty matches all rows
}