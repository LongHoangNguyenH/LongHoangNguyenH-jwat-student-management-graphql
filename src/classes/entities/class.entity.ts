import { ObjectType, Field } from '@nestjs/graphql';
import { StudentEntity } from 'src/students/entities/student.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('classes')
export class ClassEntity {
  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true, nullable: false })
  className: string;

  @OneToMany(() => StudentEntity, student => student.cls)
  @Field(() => [StudentEntity], { nullable: true })
  students?: StudentEntity[];
}
