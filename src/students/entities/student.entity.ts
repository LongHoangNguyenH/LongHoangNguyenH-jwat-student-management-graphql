import { ObjectType, Field } from '@nestjs/graphql';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('students')
export class StudentEntity {
  constructor(id: string, studentName: string, cls: ClassEntity) {
    this.id = id;
    this.studentName = studentName;
    this.cls = cls;
  }
  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column({ nullable: false, unique: true })
  studentName: string;

  @ManyToOne(() => ClassEntity, cls => cls.students, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field(() => ClassEntity, { nullable: false })
  @JoinColumn({ name: 'cls' })
  cls: ClassEntity;
}
