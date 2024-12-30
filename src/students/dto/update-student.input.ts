import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateStudentInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  studentName: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  classId: string;
}
