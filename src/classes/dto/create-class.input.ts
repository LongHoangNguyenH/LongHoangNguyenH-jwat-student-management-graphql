import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { CLASS_NAME_MAX_LENGTH, CLASS_NAME_REQUIRED, CLASS_NAME_UNVALID } from 'src/common/error/constants.error';

@InputType()
export class CreateClassInput {
  constructor(className: string) {
    this.className = className;
  }

  @Field(() => String)
  @IsString({ message: CLASS_NAME_UNVALID })
  @IsNotEmpty({ message: CLASS_NAME_REQUIRED })
  @MaxLength(9, { message: CLASS_NAME_MAX_LENGTH })
  @Matches(/^[a-zA-Z 0-9.]+$/, { message: CLASS_NAME_UNVALID })
  className: string;
}
