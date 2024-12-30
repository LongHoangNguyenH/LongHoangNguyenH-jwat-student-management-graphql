import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class DeleteMessage {
  @Field(() => String, { nullable: true })
  @IsString()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
