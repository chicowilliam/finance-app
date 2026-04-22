import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateContaDto } from '../../contas/dto/create-conta.dto';

export class UpgradeFromGuestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContaDto)
  contas: CreateContaDto[];
}
