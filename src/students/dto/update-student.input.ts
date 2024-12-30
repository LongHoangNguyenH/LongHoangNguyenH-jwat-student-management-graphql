import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, Matches } from 'class-validator';
import { CLASS_NAME_UNVALID } from 'src/common/error/constants.error';

@InputType()
export class UpdateStudentInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  @Matches(/^[a-z A-Z]+$/, { message: CLASS_NAME_UNVALID })
  studentName: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  classId: string;
}
