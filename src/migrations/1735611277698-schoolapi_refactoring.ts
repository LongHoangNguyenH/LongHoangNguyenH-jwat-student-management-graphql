import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchoolapiRefactoring1735611277698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "classes" (
          "id" VARCHAR(36) NOT NULL,
          "className" VARCHAR(9) NOT NULL,
          PRIMARY KEY (id)
        )  
      `);
    await queryRunner.query(`
        CREATE TABLE "students" (
          "id" VARCHAR(36) NOT NULL,
          "classid" VARCHAR(36) NOT NULL,
          "studentName" VARCHAR(50) NOT NULL,
          PRIMARY KEY (id),
          CONSTRAINT "FK_1f5f652d1f6b9f6e0e3e4b3b3e4" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        )  
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_1f5f652d1f6b9f6e0e3e4b3b3e4"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "classes"`);
  }
}
