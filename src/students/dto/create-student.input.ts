import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { CLASS_ID_UNVALID, STUDENT_NAME_INVALID, STUDENT_NAME_REQUIRED } from 'src/common/error/constants.error';

@InputType()
export class CreateStudentInput {
  @Field(() => String)
  @IsString({ message: STUDENT_NAME_INVALID })
  @IsNotEmpty({ message: STUDENT_NAME_REQUIRED })
  @MaxLength(50)
  @MinLength(1)
  @Matches(/^[a-zA-Z0-9]+$/, { message: STUDENT_NAME_INVALID })
  studentName: string;

  @Field(() => String)
  @IsString({ message: CLASS_ID_UNVALID })
  @IsNotEmpty({ message: CLASS_ID_UNVALID })
  @MaxLength(36)
  @MinLength(36)
  classId: string;
}
