import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { CLASS_ID_UNVALID, STUDENT_NAME_INVALID, STUDENT_NAME_REQUIRED } from 'src/common/error/constants.error';

@InputType()
export class CreateStudentInput {
  @Field(() => String)
  @IsString({ message: STUDENT_NAME_INVALID })
  @IsNotEmpty({ message: STUDENT_NAME_REQUIRED })
  @Length(2, 50)
  @Matches(/^[a-z A-Z]+$/, { message: STUDENT_NAME_INVALID })
  studentName: string;

  @Field(() => String)
  @IsString({ message: CLASS_ID_UNVALID })
  @IsNotEmpty({ message: CLASS_ID_UNVALID })
  @Length(36, 36)
  classId: string;
}
