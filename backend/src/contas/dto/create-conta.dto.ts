import {
  IsString,
  IsNumber,
  IsIn,
  IsNotEmpty,
  Min,
  Matches,
} from 'class-validator';
import { StatusConta } from '../../prisma/prisma-client';

export class CreateContaDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'vencimento deve ser no formato YYYY-MM-DD',
  })
  vencimento: string;

  @IsIn(['paga', 'a_vencer', 'atrasada'])
  status: StatusConta;

  @IsString()
  @IsNotEmpty()
  categoria: string;
}
