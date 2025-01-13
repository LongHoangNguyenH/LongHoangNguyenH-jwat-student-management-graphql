import { IsOptional, IsString, Matches } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { CLASS_NAME_UNVALID } from 'src/common/error/constants.error';

@InputType()
export class UpdateClassInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9 .]+$/, { message: CLASS_NAME_UNVALID })
  className?: string;
}
