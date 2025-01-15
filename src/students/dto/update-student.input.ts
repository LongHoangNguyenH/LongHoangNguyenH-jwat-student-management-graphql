import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, Matches } from 'class-validator';

@InputType()
export class UpdateStudentInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/)
  studentName?: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  classId?: string;
}
