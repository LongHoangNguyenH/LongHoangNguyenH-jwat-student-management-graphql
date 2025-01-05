import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentAddClassNameResponse {
  constructor(id: string, studentName: string, classId: string, className: string) {
    this.id = id;
    this.studentName = studentName;
    this.classId = classId;
    this.className = className;
  }

  @Field(() => String)
  id: string;
  @Field(() => String)
  studentName: string;
  @Field(() => String)
  classId: string;
  @Field(() => String)
  className: string;
}
