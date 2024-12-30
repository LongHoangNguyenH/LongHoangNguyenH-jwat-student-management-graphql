import { IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateClassInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  className?: string;
}
