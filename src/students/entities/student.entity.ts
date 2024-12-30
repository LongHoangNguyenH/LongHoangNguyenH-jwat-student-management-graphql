import { ObjectType, Field } from '@nestjs/graphql';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('students')
export class StudentEntity {
  constructor(id: string, studentName: string, classId: string) {
    this.id = id;
    this.studentName = studentName;
    this.classId = classId;
  }

  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column({ nullable: false, unique: true })
  studentName: string;

  @Field(() => String)
  @Column({ nullable: false })
  @JoinColumn({ name: 'classId' })
  @ManyToOne(() => ClassEntity, ClassEntity => ClassEntity.id)
  classId: string;
}
